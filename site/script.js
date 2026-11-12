const form = document.querySelector('#inquiry-form');
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const input = [...(form?.querySelectorAll('[name="service"]') || [])].find(input => input.value === link.dataset.service);
    if (input) input.checked = true;
  });
});
form?.addEventListener('submit', event => event.preventDefault());
const memoFields = document.querySelector('#memo-fields');
if (memoFields) memoFields.disabled = false;
document.querySelector('#create-inquiry')?.addEventListener('click', event => {
  event.preventDefault();
  const data = new FormData(form);
  const value = name => String(data.get(name) || '').trim() || '未定・相談希望';
  document.querySelector('#inquiry-text').value = [
    '洗濯機の作業について相談したいです。',
    `お名前：${value('customer_name')}`,
    `電話番号：${value('customer_phone')}`,
    `作業メニュー：${value('work_plan')}`,
    `搬出元郵便番号：${value('pickup_postcode')}`,
    `搬出元住所：${value('pickup_address')}`,
    `搬出元建物：${value('pickup_floor')}／エレベーター${value('pickup_elevator')}`,
    `搬出希望日時：${value('pickup_date')} ${value('pickup_time')}`,
    `搬入先郵便番号：${value('delivery_postcode')}`,
    `搬入先住所：${value('delivery_address')}`,
    `搬入先建物：${value('delivery_floor')}／エレベーター${value('delivery_elevator')}`,
    `搬入希望日時：${value('delivery_date')} ${value('delivery_time')}`,
    `希望する作業：${data.getAll('service').join('・') || '相談して決めたい'}`,
    `洗濯機のタイプ・型番：${value('machine')}`,
    `搬出元・設置先の地域：${value('area')}`,
    `希望日：${value('date')}`,
    `設置状況：${value('situation')}`,
    `建物の状況・その他：${value('notes')}`,
    '対応可否と見積もりを教えてください。'
  ].join('\n');
  document.querySelector('#inquiry-result').hidden = false;
  document.querySelector('#copy-status').textContent = '相談用の文章を作成しました。送信は行われていません。';
  document.querySelector('#inquiry-text').focus();
});
document.querySelector('#copy-inquiry')?.addEventListener('click', async () => {
  const text = document.querySelector('#inquiry-text');
  try {
    await navigator.clipboard.writeText(text.value);
    document.querySelector('#copy-status').textContent = 'コピーしました。相談する際のメモとしてご利用ください。';
  } catch {
    text.focus(); text.select();
    document.querySelector('#copy-status').textContent = '文章を選択しました。端末のコピー操作でコピーしてください。';
  }
});
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
// Hook for an approved future measurement integration; no data is transmitted.
document.querySelectorAll('[data-contact]').forEach(link => {
  link.addEventListener('click', () => document.dispatchEvent(new CustomEvent('lab:contact', {detail: {channel: link.dataset.contact}})));
});

// Reveal the estimate actions once; keep them stable and usable afterwards.
const estimateBar = document.querySelector('.mobile-contact');
if (estimateBar) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  estimateBar.classList.add('estimate-waiting');
  estimateBar.inert = true;
  let estimateTimer;
  const revealEstimateBar = () => {
    if (!estimateBar.classList.contains('estimate-waiting')) return;
    clearTimeout(estimateTimer);
    window.removeEventListener('scroll', onEstimateScroll);
    estimateBar.inert = false;
    estimateBar.classList.remove('estimate-waiting');
    if (!reducedMotion) estimateBar.classList.add('estimate-pop');
  };
  const onEstimateScroll = () => { if (window.scrollY >= 120) revealEstimateBar(); };
  window.addEventListener('scroll', onEstimateScroll, {passive: true});
  estimateTimer = setTimeout(revealEstimateBar, 1200);
  onEstimateScroll();
  estimateBar.addEventListener('animationend', () => estimateBar.classList.remove('estimate-pop'));
}
