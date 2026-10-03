(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.ExitSignalReadiness=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const questions = [
    {id:'age', q:'How long has the business been selling on Amazon?', options:[
      ['lt12','Less than 12 months','too_early','The business has less than 12 months of sales history.'],
      ['12to24','12 to 24 months','neutral','The business has at least 12 months of history.'],
      ['2to4','2 to 4 years','helps','The business has a multi-year operating history.'],
      ['4plus','More than 4 years','helps','The business has a long operating history.'] ]},
    {id:'profit', q:'Average monthly net profit over the last 12 months, before paying yourself?', options:[
      ['loss','Break-even or losing money','too_early','The business is not currently producing positive average net profit.'],
      ['under2','Under $2,000 a month','neutral','Average monthly net profit is below Empire Flippers’ published listing floor.'],
      ['2to5','$2,000 to $5,000','helps','Average monthly net profit is at or above Empire Flippers’ published floor.'],
      ['5to15','$5,000 to $15,000','helps','Average monthly net profit is above the published floor.'],
      ['15plus','More than $15,000','helps','Average monthly net profit is well above the published floor.'],
      ['unknown','Not sure','unknown','Average monthly net profit is not yet clear.'] ]},
    {id:'trend', q:'How has net profit moved over the last 12 months?', options:[
      ['growing','Growing','helps','Profit is growing.'],
      ['flat','Roughly flat','helps','Profit is relatively stable.'],
      ['down20','Down less than 20%','drag','Profit has declined.'],
      ['down20plus','Down more than 20%','blocker','Profit has fallen more than 20%.'],
      ['unknown','Not sure','unknown','The 12-month profit trend is not yet clear.'] ]},
    {id:'concentration', q:'What share of revenue comes from your single best-selling product?', options:[
      ['under30','Under 30%','helps','Revenue is not heavily concentrated in one product.'],
      ['30to60','30% to 60%','neutral','Revenue has moderate product concentration.'],
      ['over60','More than 60%','drag','More than 60% of revenue comes from one product.'],
      ['unknown','Not sure','unknown','Product concentration is not yet clear.'] ]},
    {id:'brand', q:'Do you have a registered trademark and Amazon Brand Registry?', options:[
      ['both','Yes, both','helps','The brand has a registered trademark and Brand Registry.'],
      ['filed','Trademark filed, not registered yet','neutral','The trademark process is underway.'],
      ['no','No','drag','The business lacks a registered trademark and Brand Registry.'],
      ['unknown','Not sure','unknown','Brand-protection status is not yet clear.'] ]},
    {id:'health', q:'Any Amazon account health problems in the last 12 months?', options:[
      ['none','None','helps','There is no reported account-health issue.'],
      ['resolved','Minor issues, all resolved','neutral','Past account-health issues are reported as resolved.'],
      ['active','An active warning, suspension or listing block','blocker','There is an active Amazon account-health problem.'],
      ['unknown','Not sure','unknown','Account-health status is not yet clear.'] ]},
    {id:'hours', q:'How many hours a week do you personally spend running it?', options:[
      ['under10','Under 10','helps','Owner involvement is under 10 hours a week.'],
      ['10to20','10 to 20','neutral','Owner involvement is moderate.'],
      ['20to40','20 to 40','drag','Owner involvement is 20 to 40 hours a week.'],
      ['40plus','More than 40','drag','Owner involvement is more than 40 hours a week.'] ]},
    {id:'books', q:'Can you produce a monthly profit and loss statement for the last 12 months that matches your Amazon payouts?', options:[
      ['yes','Yes, from bookkeeping software or an accountant','helps','Monthly books reportedly reconcile to Amazon payouts.'],
      ['rough','Roughly, from spreadsheets','drag','The financial records may need cleanup before diligence.'],
      ['no','No','blocker','There is no monthly P&L that matches Amazon payouts.'] ]},
    {id:'supply', q:'How dependable is your supply chain?', options:[
      ['diverse','Two or more vetted suppliers, or a written contract','helps','The supply chain has redundancy or a written agreement.'],
      ['stable','One supplier, long and stable relationship','neutral','The business relies on one stable supplier.'],
      ['fragile','One unreliable supplier','drag','The business relies on one unreliable supplier.'],
      ['unknown','Not sure','unknown','Supply-chain resilience is not yet clear.'] ]},
    {id:'timing', q:'When would you want the sale to be finished?', options:[
      ['6m','Within 6 months','neutral','You want a relatively near-term sale.'],
      ['6to12','In 6 to 12 months','neutral','You have some time to prepare.'],
      ['1to2','In 1 to 2 years','neutral','You have time to improve the business before selling.'],
      ['exploring','No plan, just exploring','neutral','You are still exploring the timing.'] ]}
  ];

  function selectedMeta(q,answers){
    const value=answers[q.id];
    const o=q.options.find(x=>x[0]===value);
    return o?{value:o[0],label:o[1],effect:o[2],reason:o[3],id:q.id}:null;
  }

  function evaluate(answers){
    const rows=questions.map(q=>selectedMeta(q,answers)).filter(Boolean);
    const tooEarly=rows.filter(r=>r.effect==='too_early');
    const unknown=rows.filter(r=>r.effect==='unknown');
    const blocker=rows.filter(r=>r.effect==='blocker');
    const drag=rows.filter(r=>r.effect==='drag');
    const criticalUnknown=rows.filter(r=>['profit','trend','health'].includes(r.id)&&r.effect==='unknown');
    let type,title,summary,priority,reasonRows;
    if(tooEarly.length){
      type='too_early'; title='Too early to tell';
      summary='The business is not yet at the point where this check can give a useful sale-readiness reading.';
      reasonRows=tooEarly.slice(0,3);
      priority=answers.age==='lt12'?'Build a full 12 months of operating history, then run the check again.':'Focus on reaching consistent positive net profit before planning a sale process.';
    } else if(criticalUnknown.length||unknown.length>=2){
      type='need_info'; title='Get the missing information first';
      summary='One or more numbers that matter to a sale decision are still unclear.';
      reasonRows=(criticalUnknown.length?criticalUnknown:unknown).slice(0,3);
      priority='Resolve the first unknown above with actual records, then rerun the check.';
    } else if(blocker.length||drag.length>=2){
      type='prepare_first'; title='Prepare first';
      summary='A sale may be possible. One or more fixable issues could create friction in diligence or reduce buyer confidence.';
      reasonRows=[...blocker,...drag].slice(0,3);
      const first=(blocker[0]||drag[0]);
      const map={health:'Resolve the active Amazon account-health issue and keep the documentation.',books:'Produce a clean 12-month monthly P&L that reconciles to Amazon payouts.',trend:'Stabilize the profit decline and understand its cause before entering a sale process.',concentration:'Reduce dependence on the single best-selling product if you have enough time to do so.',brand:'Advance trademark and Brand Registry protection.',hours:'Document and reduce owner-dependent work.',supply:'Reduce supply-chain fragility or document the supplier relationship.'};
      priority=map[first&&first.id]||'Fix the highest-risk issue above before starting a sale process.';
    } else {
      type='ready'; title='Ready to explore';
      summary='Nothing in your answers triggered an obvious stop sign under this check’s published rules.';
      reasonRows=rows.filter(r=>r.effect==='helps').slice(0,3);
      priority='Get an external valuation estimate, then decide whether the likely outcome is worth starting a sale process.';
    }
    return {type,title,summary,priority,reasons:reasonRows};
  }

  function shouldShowValuation(result,answers){
    const profitEligible=['2to5','5to15','15plus'].includes(answers.profit);
    const ageEligible=answers.age!=='lt12';
    const noActiveHealth=answers.health!=='active';
    return result.type==='ready'||(result.type==='prepare_first'&&profitEligible&&ageEligible&&noActiveHealth);
  }

  return {questions,evaluate,shouldShowValuation};
});
