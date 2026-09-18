// Local development and QA only. Production is static HTML/CSS/JS.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
module.exports=()=>http.createServer((req,res)=>{
  try {
    let name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(name.endsWith('/'))name+='index.html';
    const file=path.resolve(root,'.'+name),ext=path.extname(file);
    if(!file.startsWith(root+path.sep)||!['.html','.js','.css'].includes(ext)){res.writeHead(404).end();return;}
    const body=fs.readFileSync(file);
    res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[ext]+'; charset=utf-8');
    res.setHeader('Cache-Control','no-store');res.end(body);
  }catch{res.writeHead(404).end();}
});
