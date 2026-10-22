/* Adya Capital - open-application fee (Rs 499). Providers: razorpay_checkout (publishable key) or payment_link fallback. */
window.AdyaPay=(function(){
  var cfg=window.PAY_CONFIG||{};
  function enabled(){ return !!(cfg.provider&&(cfg.keyId||cfg.linkUrl)); }
  function loadScript(src){ return new Promise(function(res,rej){ var s=document.createElement('script'); s.src=src; s.onload=res; s.onerror=rej; document.head.appendChild(s); }); }
  function charge(opts){ /* opts: {name,email,onSuccess(paymentId),onDismiss,onError} */
    if(cfg.provider==='razorpay'&&cfg.keyId){
      var go=function(){
        var rzp=new window.Razorpay({
          key:cfg.keyId, amount:49900, currency:'INR',
          name:'Adya Capital', description:'Open application review fee',
          prefill:{name:opts.name||'',email:opts.email||''},
          theme:{color:'#2a0a14'},
          handler:function(resp){ opts.onSuccess(resp.razorpay_payment_id||''); },
          modal:{ondismiss:function(){ if(opts.onDismiss) opts.onDismiss(); }}
        });
        rzp.on('payment.failed',function(){ if(opts.onError) opts.onError('Payment failed. No money was taken - please try again.'); });
        rzp.open();
      };
      if(window.Razorpay) go(); else loadScript('https://checkout.razorpay.com/v1/checkout.js').then(go,function(){ if(opts.onError) opts.onError('Payment could not load. Check your connection and try again.'); });
    } else if(cfg.linkUrl){
      window.open(cfg.linkUrl,'_blank','noopener');
      if(opts.onError) opts.onError('Complete the payment in the new tab, then return here.');
    } else if(opts.onError) opts.onError('Payments are being set up. Please try again shortly.');
  }
  return {enabled:enabled,charge:charge};
})();
