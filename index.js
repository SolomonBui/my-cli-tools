import exifr from 'exifr';
import { stat, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileTypeFromFile } from 'file-type';

const args=process.argv.slice(2);
if(!args[0]){console.log('Usage: exif <file> [--json] [--gps] [--all]');process.exit(1)}
const f=args[0],J=args.includes('--json'),G=args.includes('--gps'),A=args.includes('--all');

function parsePdfInfo(buf){
  const txt=buf.toString('latin1');
  const info={};
  const infoMatch=txt.match(/<<[^>]*\/Author[^>]*>>/s)||txt.match(/<<[^>]*\/Creator[^>]*>>/s)||txt.match(/<<[^>]*\/Producer[^>]*>>/s);
  const patterns=[/\/Title\s*\(([^)]*)\)/,/\/Author\s*\(([^)]*)\)/,/\/Creator\s*\(([^)]*)\)/,/\/Producer\s*\(([^)]*)\)/,/\/CreationDate\s*\(([^)]*)\)/,/\/ModDate\s*\(([^)]*)\)/,/\/Subject\s*\(([^)]*)\)/,/\/Keywords\s*\(([^)]*)\)/];
  const names=['Title','Author','Creator','Producer','CreationDate','ModDate','Subject','Keywords'];
  for(let i=0;i<patterns.length;i++){const m=txt.match(patterns[i]);if(m)info[names[i]]=m[1].replace(/\\([()])/g,'$1')}
  const hexPatterns=[/\/Title\s*<([0-9A-Fa-f]+)>/,/\/Author\s*<([0-9A-Fa-f]+)>/,/\/Creator\s*<([0-9A-Fa-f]+)>/,/\/Producer\s*<([0-9A-Fa-f]+)>/];
  const hexNames=['Title','Author','Creator','Producer'];
  for(let i=0;i<hexPatterns.length;i++){if(!info[hexNames[i]]){const m=txt.match(hexPatterns[i]);if(m)info[hexNames[i]]=Buffer.from(m[1],'hex').toString('utf16le').replace(/\0/g,'')}}
  const ver=txt.match(/%PDF-(\d+\.\d+)/);if(ver)info['PDF Version']=ver[1];
  const pages=txt.match(/\/Count\s+(\d+)/);if(pages)info['Pages']=pages[1];
  return info;
}

try{
  const s=await stat(f);
  if(!s.isFile()){console.error('Not a file: '+f);process.exit(1)}
  const ft=await fileTypeFromFile(f);
  const ext=path.extname(f).toLowerCase();
  const isPdf=ext==='.pdf'||(ft&&ft.ext==='pdf');

  if(isPdf){
    const buf=await readFile(f);
    const info=parsePdfInfo(buf);
    if(J){console.log(JSON.stringify({file:{name:path.basename(f),declaredExt:ext,detectedExt:ft?.ext?'.'+ft.ext:null,mime:ft?.mime||null,size:s.size,modified:s.mtime},metadata:info},null,2))}
    else{
      console.log('File:         '+path.basename(f));
      console.log('Declared ext: '+ext);
      if(ft)console.log('Detected:     .'+ft.ext+' (MIME: '+ft.mime+')');
      console.log('Size:         '+s.size+' bytes');
      console.log('Modified:     '+s.mtime.toISOString());
      console.log('-'.repeat(60));
      if(Object.keys(info).length===0){console.log('No PDF metadata found')}
      else{for(const[k,v]of Object.entries(info))console.log(k.padEnd(28)+' '+v)}
    }
  } else {
    let d;
    if(G)d=await exifr.gps(f);
    else if(A)d=await exifr.parse(f,{tiff:true,exif:true,gps:true,interop:true,ifd1:true,iptc:true,xmp:true,icc:true});
    else d=await exifr.parse(f);
    if(J){console.log(JSON.stringify({file:{name:path.basename(f),declaredExt:ext,detectedExt:ft?.ext?'.'+ft.ext:null,mime:ft?.mime||null,size:s.size,modified:s.mtime},exif:d||{}},null,2))}
    else{
      console.log('File:         '+path.basename(f));
      console.log('Declared ext: '+ext);
      if(ft){
        const extBare=ext.replace('.','');
        const match=extBare===ft.ext||(extBare==='jpeg'&&ft.ext==='jpg');
        const tag=match?'':'  ⚠️  MISMATCH';
        console.log('Detected:     .'+ft.ext+' (MIME: '+ft.mime+')'+tag);
      } else console.log('Detected:     unknown (could not identify by magic bytes)');
      console.log('Size:         '+s.size+' bytes');
      console.log('Modified:     '+s.mtime.toISOString());
      console.log('-'.repeat(60));
      if(!d){console.log('No EXIF data');process.exit(0)}
      for(const[k,v]of Object.entries(d)){
        let x=v;
        if(v instanceof Date)x=v.toISOString();
        else if(v instanceof Uint8Array)x='<binary '+v.length+' bytes>';
        else if(typeof v==='object'&&v!==null)x=JSON.stringify(v);
        console.log(k.padEnd(28)+' '+x);
      }
    }
  }
}catch(e){console.error('Error: '+e.message);process.exit(1)}
