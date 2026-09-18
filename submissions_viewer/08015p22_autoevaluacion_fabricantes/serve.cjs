// Local preview only: node submissions_viewer/08015p22_autoevaluacion_fabricantes/serve.cjs
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const allowed=new Set(['index.html','main.js','styles.css','config.js','response_example.json']);
http.createServer((req,res)=>{
  const name=new URL(req.url,'http://localhost').pathname.slice(1)||'index.html';
  if(!allowed.has(name)){res.writeHead(404).end('No encontrado');return;}
  const mime=name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':name.endsWith('.json')?'application/json':'text/html';
  res.setHeader('Content-Type',mime+'; charset=utf-8');res.setHeader('Cache-Control','no-store');
  res.end(fs.readFileSync(path.join(__dirname,name)));
}).listen(8765,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:8765/'));
