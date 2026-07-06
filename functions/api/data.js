const json = (data, status=200) => new Response(JSON.stringify(data), {status, headers:{'content-type':'application/json'}});
async function body(request){ try{return await request.json()}catch{return {}} }
export async function onRequestGet({env, request}){
  const u = new URL(request.url); const type=u.searchParams.get('type')||'all'; const tahun=+(u.searchParams.get('tahun')||new Date().getFullYear()); const nomor=u.searchParams.get('nomor')||'';
  const whereNomor = nomor ? ' AND nomor_anggota=?' : ''; const params = nomor ? [nomor] : [];
  if(type==='kantin'||type==='retail') return json((await env.DB.prepare(`SELECT * FROM kantin_retail WHERE jenis=?${whereNomor} ORDER BY tanggal,id`).bind(type,...params).all()).results);
  if(type==='simpanan') return json((await env.DB.prepare(`SELECT * FROM simpanan WHERE tahun=?${whereNomor} ORDER BY bulan,id`).bind(tahun,...params).all()).results);
  if(type==='pinjaman') return json((await env.DB.prepare(`SELECT * FROM pinjaman WHERE tahun=?${whereNomor} ORDER BY bulan,id`).bind(tahun,...params).all()).results);
  return json({error:'type tidak dikenal'},400);
}
export async function onRequestPost({env, request}){
  const d = await body(request);
  try{
    if(d.type==='kantin'||d.type==='retail'){
      const jasa = Number(d.jasa ?? ((+d.harga_jual - +d.harga_dasar) * +d.jumlah));
      await env.DB.prepare(`INSERT OR REPLACE INTO members(nomor,nama) VALUES(?,?)`).bind(d.nomor_anggota,d.nama_anggota).run();
      const r=await env.DB.prepare(`INSERT INTO kantin_retail(jenis,tanggal,nomor_anggota,nama_anggota,barang,jumlah,harga_dasar,harga_jual,jasa) VALUES(?,?,?,?,?,?,?,?,?)`).bind(d.type,d.tanggal,d.nomor_anggota,d.nama_anggota,d.barang,+d.jumlah,+d.harga_dasar,+d.harga_jual,jasa).run();
      return json({ok:true,id:r.meta.last_row_id});
    }
    if(d.type==='simpanan'){
      await env.DB.prepare(`INSERT OR REPLACE INTO members(nomor,nama) VALUES(?,?)`).bind(d.nomor_anggota,d.nama_anggota).run();
      const r=await env.DB.prepare(`INSERT INTO simpanan(jenis,nomor_anggota,nama_anggota,bulan,tahun,jumlah) VALUES(?,?,?,?,?,?)`).bind(d.jenis,d.nomor_anggota,d.nama_anggota,+d.bulan,+d.tahun,+d.jumlah).run();
      return json({ok:true,id:r.meta.last_row_id});
    }
    if(d.type==='pinjaman'){
      await env.DB.prepare(`INSERT OR REPLACE INTO members(nomor,nama) VALUES(?,?)`).bind(d.nomor_anggota,d.nama_anggota).run();
      const r=await env.DB.prepare(`INSERT INTO pinjaman(jenis_pinjaman,nomor_anggota,nama_anggota,bulan,tahun,cicilan,jenis_jasa,jumlah_jasa,jenis_provisi,jumlah_provisi,sisa_pinjaman) VALUES(?,?,?,?,?,?,?,?,?,?,?)`).bind(d.jenis_pinjaman,d.nomor_anggota,d.nama_anggota,+d.bulan,+d.tahun,+d.cicilan,d.jenis_jasa,+d.jumlah_jasa,d.jenis_provisi,+d.jumlah_provisi,+d.sisa_pinjaman||0).run();
      return json({ok:true,id:r.meta.last_row_id});
    }
    return json({error:'type tidak dikenal'},400);
  }catch(e){return json({error:e.message},500)}
}
export async function onRequestDelete({env, request}){
  const u=new URL(request.url); const table=u.searchParams.get('table'); const id=u.searchParams.get('id');
  const allowed={kantin_retail:'kantin_retail',simpanan:'simpanan',pinjaman:'pinjaman'};
  if(!allowed[table]||!id) return json({error:'table/id salah'},400);
  await env.DB.prepare(`DELETE FROM ${allowed[table]} WHERE id=?`).bind(id).run(); return json({ok:true});
}
