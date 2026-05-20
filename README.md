# RICHRUN

대표님은 마케터 — Self Marketing Console 랜딩페이지.

## 로컬 실행

```
node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{let p=req.url==='/'?'/index.html':req.url;p=path.join(process.cwd(),decodeURIComponent(p.split('?')[0]));fs.readFile(p,(e,d)=>{if(e){res.writeHead(404);res.end('404');return}res.writeHead(200,{'Content-Type':({'.html':'text/html;charset=utf-8','.css':'text/css','.js':'application/javascript'})[path.extname(p)]||'application/octet-stream'});res.end(d)})}).listen(5173,'127.0.0.1',()=>console.log('http://127.0.0.1:5173'))"
```

## 배포

Vercel — 별도 빌드 없이 정적 파일 그대로 서빙.
