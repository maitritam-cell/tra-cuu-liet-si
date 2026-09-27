function normalizeText(value){
  return String(value??"").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"")
    .toLowerCase().replace(/đ/g,"d").replace(/\\s+/g," ").trim();
}
function esc(value){
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function getDocs(){
  return Array.isArray(window.DOCUMENTS) ? window.DOCUMENTS : [];
}
function render(items, query){
  const box=document.getElementById("results");
  if(!items.length){
    box.innerHTML = '<div class="empty">Không tìm thấy hồ sơ phù hợp.</div>';
    return;
  }
  box.innerHTML = items.map(d => {
    const href = d.url || "";
    return '<article class="result"><div><div class="result-name">'+esc(d.name)+'</div><div class="result-file">'+esc(d.file || "")+'</div></div>'
      + (href ? '<a class="button button-primary" href="'+esc(href)+'" target="_blank" rel="noopener">Xem hồ sơ PDF</a>' : '') + '</article>';
  }).join("");
}
document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("search-form");
  const input=document.getElementById("name-search");
  const status=document.getElementById("status");
  const docs=getDocs();
  status.textContent = "Đã sẵn sàng với " + docs.length + " hồ sơ.";
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const q=normalizeText(input.value);
    if(!q){status.textContent="Vui lòng nhập họ và tên.";document.getElementById("results").innerHTML="";return;}
    const parts=q.split(" ").filter(Boolean);
    const items=docs.map(d=>({...d,_n:normalizeText(d.name)}))
      .filter(d=>parts.every(p=>d._n.includes(p)))
      .sort((a,b)=>a._n.localeCompare(b._n,"vi"))
      .slice(0,50);
    status.textContent = items.length ? "Tìm thấy " + items.length + " hồ sơ." : "Không tìm thấy hồ sơ phù hợp.";
    render(items,q);
  });
});
