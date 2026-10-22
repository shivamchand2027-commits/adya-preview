/* Adya Capital - open-application fee (Rs 499).
   Provider "qr": backend mints a per-application dynamic UPI QR (single_use, exactly Rs 499);
   the applicant scans it from any UPI app and the page polls the backend until Razorpay
   confirms the money (payments_amount_received on the QR entity). Backend re-verifies at submit.
   Provider "razorpay": Standard Checkout modal (order + HMAC signature + API status). Kept as fallback.
   Provider "link": static payment link. Empty provider = fee gate off. */
window.AdyaPay=(function(){
  var cfg=window.PAY_CONFIG||{};
  function enabled(){ return !!(cfg.provider&&(cfg.provider==='qr'||cfg.keyId||cfg.linkUrl)); }
  function post(body){
    return fetch(window.BACKEND_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)})
      .then(function(r){ return r.json(); });
  }
  function loadScript(src){ return new Promise(function(res,rej){ var s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
  function createOrder(opts){
    return post({action:'createfeeorder',email:opts.email||'',name:opts.name||''})
      .then(function(j){ if(!j.ok||!j.order_id) throw new Error('order_failed'); return j.order_id; });
  }
  function createQr(opts){ /* -> {qr_id,image_url} */
    return post({action:'createfeeqr',email:opts.email||'',name:opts.name||''})
      .then(function(j){ if(!j.ok||!j.qr_id||!j.image_url) throw new Error(j.error||'qr_failed'); return j; });
  }
  function checkQr(qrId){ /* -> {paid:bool, expired:bool} */
    return post({action:'checkfeeqr',qr_id:qrId})
      .then(function(j){ if(!j.ok) throw new Error(j.error||'check_failed'); return j; });
  }
  function charge(opts){ /* checkout fallback. opts: {name,email,onSuccess({paymentId,orderId,signature}),onDismiss,onError} */
    if(cfg.keyId){
      var go=function(orderId){
        var rzp=new window.Razorpay({
          key:cfg.keyId, amount:49900, currency:'INR', order_id:orderId,
          name:'Adya Capital', description:'Open application review fee',
          prefill:{name:opts.name||'',email:opts.email||''},
          theme:{color:'#2a0a14'},
          handler:function(resp){ opts.onSuccess({paymentId:resp.razorpay_payment_id||'',orderId:resp.razorpay_order_id||orderId,signature:resp.razorpay_signature||''}); },
          modal:{ondismiss:function(){ if(opts.onDismiss) opts.onDismiss(); }}
        });
        rzp.on('payment.failed',function(){ if(opts.onError) opts.onError('Payment failed. No money was taken - please try again.'); });
        rzp.open();
      };
      var start=function(){ createOrder(opts).then(go,function(){ if(opts.onError) opts.onError('Payment could not start. Please try again in a moment.'); }); };
      if(window.Razorpay) start(); else loadScript('https://checkout.razorpay.com/v1/checkout.js').then(start,function(){ if(opts.onError) opts.onError('Payment could not load. Check your connection and try again.'); });
    } else if(cfg.linkUrl){
      window.open(cfg.linkUrl,'_blank','noopener');
      if(opts.onError) opts.onError('Complete the payment in the new tab, then return here.');
    } else if(opts.onError) opts.onError('Payments are being set up. Please try again shortly.');
  }
  return {enabled:enabled,charge:charge,createQr:createQr,checkQr:checkQr};
})();
