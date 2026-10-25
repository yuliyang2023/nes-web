(function(factory) {
if (typeof module === 'object' && module.exports) factory(require, exports, __dirname);
else if (typeof define === 'function' && define.amd) define(['require', 'exports'], function(require, exports) { factory(null, exports, null); });
})(function(nodeRequire, exports, moduleDirectory) {
'use strict';
async function create_fceumm(moduleArg={}){var moduleRtn;var Module=moduleArg;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;if(ENVIRONMENT_IS_NODE){const{createRequire}=await import("module");var require=createRequire("memory://fceumm_libretro.js")}var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var _scriptName="memory://fceumm_libretro.js";var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var readAsync,readBinary;if(ENVIRONMENT_IS_NODE){var fs=require("fs");if(_scriptName.startsWith("file:")){scriptDirectory=require("path").dirname(require("url").fileURLToPath(_scriptName))+"/"}readBinary=filename=>{filename=isFileURI(filename)?new URL(filename):filename;var ret=fs.readFileSync(filename);return ret};readAsync=async(filename,binary=true)=>{filename=isFileURI(filename)?new URL(filename):filename;var ret=fs.readFileSync(filename,binary?undefined:"utf8");return ret};if(process.argv.length>1){thisProgram=process.argv[1].replace(/\\/g,"/")}arguments_=process.argv.slice(2);quit_=(status,toThrow)=>{process.exitCode=status;throw toThrow}}else{}var out=console.log.bind(console);var err=console.error.bind(console);var wasmBinary;var ABORT=false;var isFileURI=filename=>filename.startsWith("file://");var readyPromiseResolve,readyPromiseReject;var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;var HEAP64,HEAPU64;var runtimeInitialized=false;function updateMemoryViews(){var b=wasmMemory.buffer;HEAP8=new Int8Array(b);Module["HEAP16"]=HEAP16=new Int16Array(b);Module["HEAPU8"]=HEAPU8=new Uint8Array(b);Module["HEAPU16"]=HEAPU16=new Uint16Array(b);Module["HEAP32"]=HEAP32=new Int32Array(b);Module["HEAPU32"]=HEAPU32=new Uint32Array(b);Module["HEAPF32"]=HEAPF32=new Float32Array(b);HEAPF64=new Float64Array(b);HEAP64=new BigInt64Array(b);HEAPU64=new BigUint64Array(b)}function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(onPreRuns)}function initRuntime(){runtimeInitialized=true;if(!Module["noFSInit"]&&!FS.initialized)FS.init();TTY.init();wasmExports["k"]();FS.ignorePermissions=false}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(onPostRuns)}function abort(what){Module["onAbort"]?.(what);what="Aborted("+what+")";err(what);ABORT=true;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject?.(e);throw e}var wasmBinaryFile;function findWasmBinary(){if(Module["locateFile"]){return locateFile("fceumm_libretro.wasm")}return new URL("fceumm_libretro.wasm","memory://fceumm_libretro.js").href}function getBinarySync(file){if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}async function getWasmBinary(binaryFile){if(!wasmBinary){try{var response=await readAsync(binaryFile);return new Uint8Array(response)}catch{}}return getBinarySync(binaryFile)}async function instantiateArrayBuffer(binaryFile,imports){try{var binary=await getWasmBinary(binaryFile);var instance=await WebAssembly.instantiate(binary,imports);return instance}catch(reason){err(`failed to asynchronously prepare wasm: ${reason}`);abort(reason)}}async function instantiateAsync(binary,binaryFile,imports){if(!binary&&!ENVIRONMENT_IS_NODE){try{var response=fetch(binaryFile,{credentials:"same-origin"});var instantiationResult=await WebAssembly.instantiateStreaming(response,imports);return instantiationResult}catch(reason){err(`wasm streaming compile failed: ${reason}`);err("falling back to ArrayBuffer instantiation")}}return instantiateArrayBuffer(binaryFile,imports)}function getWasmImports(){var imports={a:wasmImports};return imports}async function createWasm(){function receiveInstance(instance,module){wasmExports=instance.exports;assignWasmExports(wasmExports);updateMemoryViews();return wasmExports}function receiveInstantiationResult(result){return receiveInstance(result["instance"])}var info=getWasmImports();if(Module["instantiateWasm"]){return new Promise((resolve,reject)=>{Module["instantiateWasm"](info,(inst,mod)=>{resolve(receiveInstance(inst,mod))})})}wasmBinaryFile??=findWasmBinary();var result=await instantiateAsync(wasmBinary,wasmBinaryFile,info);var exports=receiveInstantiationResult(result);return exports}class ExitStatus{name="ExitStatus";constructor(status){this.message=`Program terminated with exit(${status})`;this.status=status}}var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){callbacks.shift()(Module)}};var onPostRuns=[];var addOnPostRun=cb=>onPostRuns.push(cb);var onPreRuns=[];var addOnPreRun=cb=>onPreRuns.push(cb);function getValue(ptr,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":return HEAP8[ptr];case"i8":return HEAP8[ptr];case"i16":return HEAP16[ptr>>1];case"i32":return HEAP32[ptr>>2];case"i64":return HEAP64[ptr>>3];case"float":return HEAPF32[ptr>>2];case"double":return HEAPF64[ptr>>3];case"*":return HEAPU32[ptr>>2];default:abort(`invalid type for getValue: ${type}`)}}var noExitRuntime=true;function setValue(ptr,value,type="i8"){if(type.endsWith("*"))type="*";switch(type){case"i1":HEAP8[ptr]=value;break;case"i8":HEAP8[ptr]=value;break;case"i16":HEAP16[ptr>>1]=value;break;case"i32":HEAP32[ptr>>2]=value;break;case"i64":HEAP64[ptr>>3]=BigInt(value);break;case"float":HEAPF32[ptr>>2]=value;break;case"double":HEAPF64[ptr>>3]=value;break;case"*":HEAPU32[ptr>>2]=value;break;default:abort(`invalid type for setValue: ${type}`)}}var stackRestore=val=>__emscripten_stack_restore(val);var stackSave=()=>_emscripten_stack_get_current();var syscallGetVarargI=()=>{var ret=HEAP32[+SYSCALLS.varargs>>2];SYSCALLS.varargs+=4;return ret};var syscallGetVarargP=syscallGetVarargI;var PATH={isAbs:path=>path.charAt(0)==="/",splitPath:filename=>{var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return splitPathRe.exec(filename).slice(1)},normalizeArray:(parts,allowAboveRoot)=>{var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift("..")}}return parts},normalize:path=>{var isAbsolute=PATH.isAbs(path),trailingSlash=path.slice(-1)==="/";path=PATH.normalizeArray(path.split("/").filter(p=>!!p),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path},dirname:path=>{var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.slice(0,-1)}return root+dir},basename:path=>path&&path.match(/([^\/]+|\/)\/*$/)[1],join:(...paths)=>PATH.normalize(paths.join("/")),join2:(l,r)=>PATH.normalize(l+"/"+r)};var initRandomFill=()=>{if(ENVIRONMENT_IS_NODE){var nodeCrypto=require("crypto");return view=>nodeCrypto.randomFillSync(view)}return view=>crypto.getRandomValues(view)};var randomFill=view=>{(randomFill=initRandomFill())(view)};var PATH_FS={resolve:(...args)=>{var resolvedPath="",resolvedAbsolute=false;for(var i=args.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?args[i]:FS.cwd();if(typeof path!="string"){throw new TypeError("Arguments to path.resolve must be strings")}else if(!path){return""}resolvedPath=path+"/"+resolvedPath;resolvedAbsolute=PATH.isAbs(path)}resolvedPath=PATH.normalizeArray(resolvedPath.split("/").filter(p=>!!p),!resolvedAbsolute).join("/");return(resolvedAbsolute?"/":"")+resolvedPath||"."},relative:(from,to)=>{from=PATH_FS.resolve(from).slice(1);to=PATH_FS.resolve(to).slice(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=="")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=="")break}if(start>end)return[];return arr.slice(start,end-start+1)}var fromParts=trim(from.split("/"));var toParts=trim(to.split("/"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push("..")}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join("/")}};var UTF8Decoder=globalThis.TextDecoder&&new TextDecoder;var findStringEnd=(heapOrArray,idx,maxBytesToRead,ignoreNul)=>{var maxIdx=idx+maxBytesToRead;if(ignoreNul)return maxIdx;while(heapOrArray[idx]&&!(idx>=maxIdx))++idx;return idx};var UTF8ArrayToString=(heapOrArray,idx=0,maxBytesToRead,ignoreNul)=>{var endPtr=findStringEnd(heapOrArray,idx,maxBytesToRead,ignoreNul);if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str};var FS_stdin_getChar_buffer=[];var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++}else if(c<=2047){len+=2}else if(c>=55296&&c<=57343){len+=4;++i}else{len+=3}}return len};var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.codePointAt(i);if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;i++}}heap[outIdx]=0;return outIdx-startIdx};var intArrayFromString=(stringy,dontAddNull,length)=>{var len=length>0?length:lengthBytesUTF8(stringy)+1;var u8array=new Array(len);var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);if(dontAddNull)u8array.length=numBytesWritten;return u8array};var FS_stdin_getChar=()=>{if(!FS_stdin_getChar_buffer.length){var result=null;if(ENVIRONMENT_IS_NODE){var BUFSIZE=256;var buf=Buffer.alloc(BUFSIZE);var bytesRead=0;var fd=process.stdin.fd;try{bytesRead=fs.readSync(fd,buf,0,BUFSIZE)}catch(e){if(e.toString().includes("EOF"))bytesRead=0;else throw e}if(bytesRead>0){result=buf.slice(0,bytesRead).toString("utf-8")}}else{}if(!result){return null}FS_stdin_getChar_buffer=intArrayFromString(result,true)}return FS_stdin_getChar_buffer.shift()};var TTY={ttys:[],init(){},shutdown(){},register(dev,ops){TTY.ttys[dev]={input:[],output:[],ops};FS.registerDevice(dev,TTY.stream_ops)},stream_ops:{open(stream){var tty=TTY.ttys[stream.node.rdev];if(!tty){throw new FS.ErrnoError(43)}stream.tty=tty;stream.seekable=false},close(stream){stream.tty.ops.fsync(stream.tty)},fsync(stream){stream.tty.ops.fsync(stream.tty)},read(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.get_char){throw new FS.ErrnoError(60)}var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=stream.tty.ops.get_char(stream.tty)}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.atime=Date.now()}return bytesRead},write(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.put_char){throw new FS.ErrnoError(60)}try{for(var i=0;i<length;i++){stream.tty.ops.put_char(stream.tty,buffer[offset+i])}}catch(e){throw new FS.ErrnoError(29)}if(length){stream.node.mtime=stream.node.ctime=Date.now()}return i}},default_tty_ops:{get_char(tty){return FS_stdin_getChar()},put_char(tty,val){if(val===null||val===10){out(UTF8ArrayToString(tty.output));tty.output=[]}else{if(val!=0)tty.output.push(val)}},fsync(tty){if(tty.output?.length>0){out(UTF8ArrayToString(tty.output));tty.output=[]}},ioctl_tcgets(tty){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(tty,optional_actions,data){return 0},ioctl_tiocgwinsz(tty){return[24,80]}},default_tty1_ops:{put_char(tty,val){if(val===null||val===10){err(UTF8ArrayToString(tty.output));tty.output=[]}else{if(val!=0)tty.output.push(val)}},fsync(tty){if(tty.output?.length>0){err(UTF8ArrayToString(tty.output));tty.output=[]}}}};var mmapAlloc=size=>{abort()};var MEMFS={ops_table:null,mount(mount){return MEMFS.createNode(null,"/",16895,0)},createNode(parent,name,mode,dev){if(FS.isBlkdev(mode)||FS.isFIFO(mode)){throw new FS.ErrnoError(63)}MEMFS.ops_table||={dir:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,lookup:MEMFS.node_ops.lookup,mknod:MEMFS.node_ops.mknod,rename:MEMFS.node_ops.rename,unlink:MEMFS.node_ops.unlink,rmdir:MEMFS.node_ops.rmdir,readdir:MEMFS.node_ops.readdir,symlink:MEMFS.node_ops.symlink},stream:{llseek:MEMFS.stream_ops.llseek}},file:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:{llseek:MEMFS.stream_ops.llseek,read:MEMFS.stream_ops.read,write:MEMFS.stream_ops.write,mmap:MEMFS.stream_ops.mmap,msync:MEMFS.stream_ops.msync}},link:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,readlink:MEMFS.node_ops.readlink},stream:{}},chrdev:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:FS.chrdev_stream_ops}};var node=FS.createNode(parent,name,mode,dev);if(FS.isDir(node.mode)){node.node_ops=MEMFS.ops_table.dir.node;node.stream_ops=MEMFS.ops_table.dir.stream;node.contents={}}else if(FS.isFile(node.mode)){node.node_ops=MEMFS.ops_table.file.node;node.stream_ops=MEMFS.ops_table.file.stream;node.usedBytes=0;node.contents=null}else if(FS.isLink(node.mode)){node.node_ops=MEMFS.ops_table.link.node;node.stream_ops=MEMFS.ops_table.link.stream}else if(FS.isChrdev(node.mode)){node.node_ops=MEMFS.ops_table.chrdev.node;node.stream_ops=MEMFS.ops_table.chrdev.stream}node.atime=node.mtime=node.ctime=Date.now();if(parent){parent.contents[name]=node;parent.atime=parent.mtime=parent.ctime=node.atime}return node},getFileDataAsTypedArray(node){if(!node.contents)return new Uint8Array(0);if(node.contents.subarray)return node.contents.subarray(0,node.usedBytes);return new Uint8Array(node.contents)},expandFileStorage(node,newCapacity){var prevCapacity=node.contents?node.contents.length:0;if(prevCapacity>=newCapacity)return;var CAPACITY_DOUBLING_MAX=1024*1024;newCapacity=Math.max(newCapacity,prevCapacity*(prevCapacity<CAPACITY_DOUBLING_MAX?2:1.125)>>>0);if(prevCapacity!=0)newCapacity=Math.max(newCapacity,256);var oldContents=node.contents;node.contents=new Uint8Array(newCapacity);if(node.usedBytes>0)node.contents.set(oldContents.subarray(0,node.usedBytes),0)},resizeFileStorage(node,newSize){if(node.usedBytes==newSize)return;if(newSize==0){node.contents=null;node.usedBytes=0}else{var oldContents=node.contents;node.contents=new Uint8Array(newSize);if(oldContents){node.contents.set(oldContents.subarray(0,Math.min(newSize,node.usedBytes)))}node.usedBytes=newSize}},node_ops:{getattr(node){var attr={};attr.dev=FS.isChrdev(node.mode)?node.id:1;attr.ino=node.id;attr.mode=node.mode;attr.nlink=1;attr.uid=0;attr.gid=0;attr.rdev=node.rdev;if(FS.isDir(node.mode)){attr.size=4096}else if(FS.isFile(node.mode)){attr.size=node.usedBytes}else if(FS.isLink(node.mode)){attr.size=node.link.length}else{attr.size=0}attr.atime=new Date(node.atime);attr.mtime=new Date(node.mtime);attr.ctime=new Date(node.ctime);attr.blksize=4096;attr.blocks=Math.ceil(attr.size/attr.blksize);return attr},setattr(node,attr){for(const key of["mode","atime","mtime","ctime"]){if(attr[key]!=null){node[key]=attr[key]}}if(attr.size!==undefined){MEMFS.resizeFileStorage(node,attr.size)}},lookup(parent,name){if(!MEMFS.doesNotExistError){MEMFS.doesNotExistError=new FS.ErrnoError(44);MEMFS.doesNotExistError.stack="<generic error, no stack>"}throw MEMFS.doesNotExistError},mknod(parent,name,mode,dev){return MEMFS.createNode(parent,name,mode,dev)},rename(old_node,new_dir,new_name){var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(new_node){if(FS.isDir(old_node.mode)){for(var i in new_node.contents){throw new FS.ErrnoError(55)}}FS.hashRemoveNode(new_node)}delete old_node.parent.contents[old_node.name];new_dir.contents[new_name]=old_node;old_node.name=new_name;new_dir.ctime=new_dir.mtime=old_node.parent.ctime=old_node.parent.mtime=Date.now()},unlink(parent,name){delete parent.contents[name];parent.ctime=parent.mtime=Date.now()},rmdir(parent,name){var node=FS.lookupNode(parent,name);for(var i in node.contents){throw new FS.ErrnoError(55)}delete parent.contents[name];parent.ctime=parent.mtime=Date.now()},readdir(node){return[".","..",...Object.keys(node.contents)]},symlink(parent,newname,oldpath){var node=MEMFS.createNode(parent,newname,511|40960,0);node.link=oldpath;return node},readlink(node){if(!FS.isLink(node.mode)){throw new FS.ErrnoError(28)}return node.link}},stream_ops:{read(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=stream.node.usedBytes)return 0;var size=Math.min(stream.node.usedBytes-position,length);if(size>8&&contents.subarray){buffer.set(contents.subarray(position,position+size),offset)}else{for(var i=0;i<size;i++)buffer[offset+i]=contents[position+i]}return size},write(stream,buffer,offset,length,position,canOwn){if(buffer.buffer===HEAP8.buffer){canOwn=false}if(!length)return 0;var node=stream.node;node.mtime=node.ctime=Date.now();if(buffer.subarray&&(!node.contents||node.contents.subarray)){if(canOwn){node.contents=buffer.subarray(offset,offset+length);node.usedBytes=length;return length}else if(node.usedBytes===0&&position===0){node.contents=buffer.slice(offset,offset+length);node.usedBytes=length;return length}else if(position+length<=node.usedBytes){node.contents.set(buffer.subarray(offset,offset+length),position);return length}}MEMFS.expandFileStorage(node,position+length);if(node.contents.subarray&&buffer.subarray){node.contents.set(buffer.subarray(offset,offset+length),position)}else{for(var i=0;i<length;i++){node.contents[position+i]=buffer[offset+i]}}node.usedBytes=Math.max(node.usedBytes,position+length);return length},llseek(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.usedBytes}}if(position<0){throw new FS.ErrnoError(28)}return position},mmap(stream,length,position,prot,flags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}var ptr;var allocated;var contents=stream.node.contents;if(!(flags&2)&&contents&&contents.buffer===HEAP8.buffer){allocated=false;ptr=contents.byteOffset}else{allocated=true;ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}if(contents){if(position>0||position+length<contents.length){if(contents.subarray){contents=contents.subarray(position,position+length)}else{contents=Array.prototype.slice.call(contents,position,position+length)}}HEAP8.set(contents,ptr)}}return{ptr,allocated}},msync(stream,buffer,offset,length,mmapFlags){MEMFS.stream_ops.write(stream,buffer,0,length,offset,false);return 0}}};var FS_modeStringToFlags=str=>{var flagModes={r:0,"r+":2,w:512|64|1,"w+":512|64|2,a:1024|64|1,"a+":1024|64|2};var flags=flagModes[str];if(typeof flags=="undefined"){throw new Error(`Unknown file open mode: ${str}`)}return flags};var FS_getMode=(canRead,canWrite)=>{var mode=0;if(canRead)mode|=292|73;if(canWrite)mode|=146;return mode};var asyncLoad=async url=>{var arrayBuffer=await readAsync(url);return new Uint8Array(arrayBuffer)};var FS_createDataFile=(...args)=>FS.createDataFile(...args);var getUniqueRunDependency=id=>id;var runDependencies=0;var dependenciesFulfilled=null;var removeRunDependency=id=>{runDependencies--;Module["monitorRunDependencies"]?.(runDependencies);if(runDependencies==0){if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}};var addRunDependency=id=>{runDependencies++;Module["monitorRunDependencies"]?.(runDependencies)};var preloadPlugins=[];var FS_handledByPreloadPlugin=async(byteArray,fullname)=>{if(typeof Browser!="undefined")Browser.init();for(var plugin of preloadPlugins){if(plugin["canHandle"](fullname)){return plugin["handle"](byteArray,fullname)}}return byteArray};var FS_preloadFile=async(parent,name,url,canRead,canWrite,dontCreateFile,canOwn,preFinish)=>{var fullname=name?PATH_FS.resolve(PATH.join2(parent,name)):parent;var dep=getUniqueRunDependency(`cp ${fullname}`);addRunDependency(dep);try{var byteArray=url;if(typeof url=="string"){byteArray=await asyncLoad(url)}byteArray=await FS_handledByPreloadPlugin(byteArray,fullname);preFinish?.();if(!dontCreateFile){FS_createDataFile(parent,name,byteArray,canRead,canWrite,canOwn)}}finally{removeRunDependency(dep)}};var FS_createPreloadedFile=(parent,name,url,canRead,canWrite,onload,onerror,dontCreateFile,canOwn,preFinish)=>{FS_preloadFile(parent,name,url,canRead,canWrite,dontCreateFile,canOwn,preFinish).then(onload).catch(onerror)};var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,filesystems:null,syncFSRequests:0,readFiles:{},ErrnoError:class{name="ErrnoError";constructor(errno){this.errno=errno}},FSStream:class{shared={};get object(){return this.node}set object(val){this.node=val}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(val){this.shared.flags=val}get position(){return this.shared.position}set position(val){this.shared.position=val}},FSNode:class{node_ops={};stream_ops={};readMode=292|73;writeMode=146;mounted=null;constructor(parent,name,mode,rdev){if(!parent){parent=this}this.parent=parent;this.mount=parent.mount;this.id=FS.nextInode++;this.name=name;this.mode=mode;this.rdev=rdev;this.atime=this.mtime=this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(val){val?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(val){val?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return FS.isDir(this.mode)}get isDevice(){return FS.isChrdev(this.mode)}},lookupPath(path,opts={}){if(!path){throw new FS.ErrnoError(44)}opts.follow_mount??=true;if(!PATH.isAbs(path)){path=FS.cwd()+"/"+path}linkloop:for(var nlinks=0;nlinks<40;nlinks++){var parts=path.split("/").filter(p=>!!p);var current=FS.root;var current_path="/";for(var i=0;i<parts.length;i++){var islast=i===parts.length-1;if(islast&&opts.parent){break}if(parts[i]==="."){continue}if(parts[i]===".."){current_path=PATH.dirname(current_path);if(FS.isRoot(current)){path=current_path+"/"+parts.slice(i+1).join("/");nlinks--;continue linkloop}else{current=current.parent}continue}current_path=PATH.join2(current_path,parts[i]);try{current=FS.lookupNode(current,parts[i])}catch(e){if(e?.errno===44&&islast&&opts.noent_okay){return{path:current_path}}throw e}if(FS.isMountpoint(current)&&(!islast||opts.follow_mount)){current=current.mounted.root}if(FS.isLink(current.mode)&&(!islast||opts.follow)){if(!current.node_ops.readlink){throw new FS.ErrnoError(52)}var link=current.node_ops.readlink(current);if(!PATH.isAbs(link)){link=PATH.dirname(current_path)+"/"+link}path=link+"/"+parts.slice(i+1).join("/");continue linkloop}}return{path:current_path,node:current}}throw new FS.ErrnoError(32)},getPath(node){var path;while(true){if(FS.isRoot(node)){var mount=node.mount.mountpoint;if(!path)return mount;return mount[mount.length-1]!=="/"?`${mount}/${path}`:mount+path}path=path?`${node.name}/${path}`:node.name;node=node.parent}},hashName(parentid,name){var hash=0;for(var i=0;i<name.length;i++){hash=(hash<<5)-hash+name.charCodeAt(i)|0}return(parentid+hash>>>0)%FS.nameTable.length},hashAddNode(node){var hash=FS.hashName(node.parent.id,node.name);node.name_next=FS.nameTable[hash];FS.nameTable[hash]=node},hashRemoveNode(node){var hash=FS.hashName(node.parent.id,node.name);if(FS.nameTable[hash]===node){FS.nameTable[hash]=node.name_next}else{var current=FS.nameTable[hash];while(current){if(current.name_next===node){current.name_next=node.name_next;break}current=current.name_next}}},lookupNode(parent,name){var errCode=FS.mayLookup(parent);if(errCode){throw new FS.ErrnoError(errCode)}var hash=FS.hashName(parent.id,name);for(var node=FS.nameTable[hash];node;node=node.name_next){var nodeName=node.name;if(node.parent.id===parent.id&&nodeName===name){return node}}return FS.lookup(parent,name)},createNode(parent,name,mode,rdev){var node=new FS.FSNode(parent,name,mode,rdev);FS.hashAddNode(node);return node},destroyNode(node){FS.hashRemoveNode(node)},isRoot(node){return node===node.parent},isMountpoint(node){return!!node.mounted},isFile(mode){return(mode&61440)===32768},isDir(mode){return(mode&61440)===16384},isLink(mode){return(mode&61440)===40960},isChrdev(mode){return(mode&61440)===8192},isBlkdev(mode){return(mode&61440)===24576},isFIFO(mode){return(mode&61440)===4096},isSocket(mode){return(mode&49152)===49152},flagsToPermissionString(flag){var perms=["r","w","rw"][flag&3];if(flag&512){perms+="w"}return perms},nodePermissions(node,perms){if(FS.ignorePermissions){return 0}if(perms.includes("r")&&!(node.mode&292)){return 2}else if(perms.includes("w")&&!(node.mode&146)){return 2}else if(perms.includes("x")&&!(node.mode&73)){return 2}return 0},mayLookup(dir){if(!FS.isDir(dir.mode))return 54;var errCode=FS.nodePermissions(dir,"x");if(errCode)return errCode;if(!dir.node_ops.lookup)return 2;return 0},mayCreate(dir,name){if(!FS.isDir(dir.mode)){return 54}try{var node=FS.lookupNode(dir,name);return 20}catch(e){}return FS.nodePermissions(dir,"wx")},mayDelete(dir,name,isdir){var node;try{node=FS.lookupNode(dir,name)}catch(e){return e.errno}var errCode=FS.nodePermissions(dir,"wx");if(errCode){return errCode}if(isdir){if(!FS.isDir(node.mode)){return 54}if(FS.isRoot(node)||FS.getPath(node)===FS.cwd()){return 10}}else{if(FS.isDir(node.mode)){return 31}}return 0},mayOpen(node,flags){if(!node){return 44}if(FS.isLink(node.mode)){return 32}else if(FS.isDir(node.mode)){if(FS.flagsToPermissionString(flags)!=="r"||flags&(512|64)){return 31}}return FS.nodePermissions(node,FS.flagsToPermissionString(flags))},checkOpExists(op,err){if(!op){throw new FS.ErrnoError(err)}return op},MAX_OPEN_FDS:4096,nextfd(){for(var fd=0;fd<=FS.MAX_OPEN_FDS;fd++){if(!FS.streams[fd]){return fd}}throw new FS.ErrnoError(33)},getStreamChecked(fd){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}return stream},getStream:fd=>FS.streams[fd],createStream(stream,fd=-1){stream=Object.assign(new FS.FSStream,stream);if(fd==-1){fd=FS.nextfd()}stream.fd=fd;FS.streams[fd]=stream;return stream},closeStream(fd){FS.streams[fd]=null},dupStream(origStream,fd=-1){var stream=FS.createStream(origStream,fd);stream.stream_ops?.dup?.(stream);return stream},doSetAttr(stream,node,attr){var setattr=stream?.stream_ops.setattr;var arg=setattr?stream:node;setattr??=node.node_ops.setattr;FS.checkOpExists(setattr,63);setattr(arg,attr)},chrdev_stream_ops:{open(stream){var device=FS.getDevice(stream.node.rdev);stream.stream_ops=device.stream_ops;stream.stream_ops.open?.(stream)},llseek(){throw new FS.ErrnoError(70)}},major:dev=>dev>>8,minor:dev=>dev&255,makedev:(ma,mi)=>ma<<8|mi,registerDevice(dev,ops){FS.devices[dev]={stream_ops:ops}},getDevice:dev=>FS.devices[dev],getMounts(mount){var mounts=[];var check=[mount];while(check.length){var m=check.pop();mounts.push(m);check.push(...m.mounts)}return mounts},syncfs(populate,callback){if(typeof populate=="function"){callback=populate;populate=false}FS.syncFSRequests++;if(FS.syncFSRequests>1){err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`)}var mounts=FS.getMounts(FS.root.mount);var completed=0;function doCallback(errCode){FS.syncFSRequests--;return callback(errCode)}function done(errCode){if(errCode){if(!done.errored){done.errored=true;return doCallback(errCode)}return}if(++completed>=mounts.length){doCallback(null)}}mounts.forEach(mount=>{if(!mount.type.syncfs){return done(null)}mount.type.syncfs(mount,populate,done)})},mount(type,opts,mountpoint){var root=mountpoint==="/";var pseudo=!mountpoint;var node;if(root&&FS.root){throw new FS.ErrnoError(10)}else if(!root&&!pseudo){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});mountpoint=lookup.path;node=lookup.node;if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}if(!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}}var mount={type,opts,mountpoint,mounts:[]};var mountRoot=type.mount(mount);mountRoot.mount=mount;mount.root=mountRoot;if(root){FS.root=mountRoot}else if(node){node.mounted=mount;if(node.mount){node.mount.mounts.push(mount)}}return mountRoot},unmount(mountpoint){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});if(!FS.isMountpoint(lookup.node)){throw new FS.ErrnoError(28)}var node=lookup.node;var mount=node.mounted;var mounts=FS.getMounts(mount);Object.keys(FS.nameTable).forEach(hash=>{var current=FS.nameTable[hash];while(current){var next=current.name_next;if(mounts.includes(current.mount)){FS.destroyNode(current)}current=next}});node.mounted=null;var idx=node.mount.mounts.indexOf(mount);node.mount.mounts.splice(idx,1)},lookup(parent,name){return parent.node_ops.lookup(parent,name)},mknod(path,mode,dev){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);if(!name){throw new FS.ErrnoError(28)}if(name==="."||name===".."){throw new FS.ErrnoError(20)}var errCode=FS.mayCreate(parent,name);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.mknod){throw new FS.ErrnoError(63)}return parent.node_ops.mknod(parent,name,mode,dev)},statfs(path){return FS.statfsNode(FS.lookupPath(path,{follow:true}).node)},statfsStream(stream){return FS.statfsNode(stream.node)},statfsNode(node){var rtn={bsize:4096,frsize:4096,blocks:1e6,bfree:5e5,bavail:5e5,files:FS.nextInode,ffree:FS.nextInode-1,fsid:42,flags:2,namelen:255};if(node.node_ops.statfs){Object.assign(rtn,node.node_ops.statfs(node.mount.opts.root))}return rtn},create(path,mode=438){mode&=4095;mode|=32768;return FS.mknod(path,mode,0)},mkdir(path,mode=511){mode&=511|512;mode|=16384;return FS.mknod(path,mode,0)},mkdirTree(path,mode){var dirs=path.split("/");var d="";for(var dir of dirs){if(!dir)continue;if(d||PATH.isAbs(path))d+="/";d+=dir;try{FS.mkdir(d,mode)}catch(e){if(e.errno!=20)throw e}}},mkdev(path,mode,dev){if(typeof dev=="undefined"){dev=mode;mode=438}mode|=8192;return FS.mknod(path,mode,dev)},symlink(oldpath,newpath){if(!PATH_FS.resolve(oldpath)){throw new FS.ErrnoError(44)}var lookup=FS.lookupPath(newpath,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var newname=PATH.basename(newpath);var errCode=FS.mayCreate(parent,newname);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.symlink){throw new FS.ErrnoError(63)}return parent.node_ops.symlink(parent,newname,oldpath)},rename(old_path,new_path){var old_dirname=PATH.dirname(old_path);var new_dirname=PATH.dirname(new_path);var old_name=PATH.basename(old_path);var new_name=PATH.basename(new_path);var lookup,old_dir,new_dir;lookup=FS.lookupPath(old_path,{parent:true});old_dir=lookup.node;lookup=FS.lookupPath(new_path,{parent:true});new_dir=lookup.node;if(!old_dir||!new_dir)throw new FS.ErrnoError(44);if(old_dir.mount!==new_dir.mount){throw new FS.ErrnoError(75)}var old_node=FS.lookupNode(old_dir,old_name);var relative=PATH_FS.relative(old_path,new_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(28)}relative=PATH_FS.relative(new_path,old_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(55)}var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(old_node===new_node){return}var isdir=FS.isDir(old_node.mode);var errCode=FS.mayDelete(old_dir,old_name,isdir);if(errCode){throw new FS.ErrnoError(errCode)}errCode=new_node?FS.mayDelete(new_dir,new_name,isdir):FS.mayCreate(new_dir,new_name);if(errCode){throw new FS.ErrnoError(errCode)}if(!old_dir.node_ops.rename){throw new FS.ErrnoError(63)}if(FS.isMountpoint(old_node)||new_node&&FS.isMountpoint(new_node)){throw new FS.ErrnoError(10)}if(new_dir!==old_dir){errCode=FS.nodePermissions(old_dir,"w");if(errCode){throw new FS.ErrnoError(errCode)}}FS.hashRemoveNode(old_node);try{old_dir.node_ops.rename(old_node,new_dir,new_name);old_node.parent=new_dir}catch(e){throw e}finally{FS.hashAddNode(old_node)}},rmdir(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,true);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.rmdir){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.rmdir(parent,name);FS.destroyNode(node)},readdir(path){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;var readdir=FS.checkOpExists(node.node_ops.readdir,54);return readdir(node)},unlink(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,false);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.unlink){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.unlink(parent,name);FS.destroyNode(node)},readlink(path){var lookup=FS.lookupPath(path);var link=lookup.node;if(!link){throw new FS.ErrnoError(44)}if(!link.node_ops.readlink){throw new FS.ErrnoError(28)}return link.node_ops.readlink(link)},stat(path,dontFollow){var lookup=FS.lookupPath(path,{follow:!dontFollow});var node=lookup.node;var getattr=FS.checkOpExists(node.node_ops.getattr,63);return getattr(node)},fstat(fd){var stream=FS.getStreamChecked(fd);var node=stream.node;var getattr=stream.stream_ops.getattr;var arg=getattr?stream:node;getattr??=node.node_ops.getattr;FS.checkOpExists(getattr,63);return getattr(arg)},lstat(path){return FS.stat(path,true)},doChmod(stream,node,mode,dontFollow){FS.doSetAttr(stream,node,{mode:mode&4095|node.mode&~4095,ctime:Date.now(),dontFollow})},chmod(path,mode,dontFollow){var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}FS.doChmod(null,node,mode,dontFollow)},lchmod(path,mode){FS.chmod(path,mode,true)},fchmod(fd,mode){var stream=FS.getStreamChecked(fd);FS.doChmod(stream,stream.node,mode,false)},doChown(stream,node,dontFollow){FS.doSetAttr(stream,node,{timestamp:Date.now(),dontFollow})},chown(path,uid,gid,dontFollow){var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}FS.doChown(null,node,dontFollow)},lchown(path,uid,gid){FS.chown(path,uid,gid,true)},fchown(fd,uid,gid){var stream=FS.getStreamChecked(fd);FS.doChown(stream,stream.node,false)},doTruncate(stream,node,len){if(FS.isDir(node.mode)){throw new FS.ErrnoError(31)}if(!FS.isFile(node.mode)){throw new FS.ErrnoError(28)}var errCode=FS.nodePermissions(node,"w");if(errCode){throw new FS.ErrnoError(errCode)}FS.doSetAttr(stream,node,{size:len,timestamp:Date.now()})},truncate(path,len){if(len<0){throw new FS.ErrnoError(28)}var node;if(typeof path=="string"){var lookup=FS.lookupPath(path,{follow:true});node=lookup.node}else{node=path}FS.doTruncate(null,node,len)},ftruncate(fd,len){var stream=FS.getStreamChecked(fd);if(len<0||(stream.flags&2097155)===0){throw new FS.ErrnoError(28)}FS.doTruncate(stream,stream.node,len)},utime(path,atime,mtime){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;var setattr=FS.checkOpExists(node.node_ops.setattr,63);setattr(node,{atime,mtime})},open(path,flags,mode=438){if(path===""){throw new FS.ErrnoError(44)}flags=typeof flags=="string"?FS_modeStringToFlags(flags):flags;if(flags&64){mode=mode&4095|32768}else{mode=0}var node;var isDirPath;if(typeof path=="object"){node=path}else{isDirPath=path.endsWith("/");var lookup=FS.lookupPath(path,{follow:!(flags&131072),noent_okay:true});node=lookup.node;path=lookup.path}var created=false;if(flags&64){if(node){if(flags&128){throw new FS.ErrnoError(20)}}else if(isDirPath){throw new FS.ErrnoError(31)}else{node=FS.mknod(path,mode|511,0);created=true}}if(!node){throw new FS.ErrnoError(44)}if(FS.isChrdev(node.mode)){flags&=~512}if(flags&65536&&!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}if(!created){var errCode=FS.mayOpen(node,flags);if(errCode){throw new FS.ErrnoError(errCode)}}if(flags&512&&!created){FS.truncate(node,0)}flags&=~(128|512|131072);var stream=FS.createStream({node,path:FS.getPath(node),flags,seekable:true,position:0,stream_ops:node.stream_ops,ungotten:[],error:false});if(stream.stream_ops.open){stream.stream_ops.open(stream)}if(created){FS.chmod(node,mode&511)}if(Module["logReadFiles"]&&!(flags&1)){if(!(path in FS.readFiles)){FS.readFiles[path]=1}}return stream},close(stream){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(stream.getdents)stream.getdents=null;try{if(stream.stream_ops.close){stream.stream_ops.close(stream)}}catch(e){throw e}finally{FS.closeStream(stream.fd)}stream.fd=null},isClosed(stream){return stream.fd===null},llseek(stream,offset,whence){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(!stream.seekable||!stream.stream_ops.llseek){throw new FS.ErrnoError(70)}if(whence!=0&&whence!=1&&whence!=2){throw new FS.ErrnoError(28)}stream.position=stream.stream_ops.llseek(stream,offset,whence);stream.ungotten=[];return stream.position},read(stream,buffer,offset,length,position){if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.read){throw new FS.ErrnoError(28)}var seeking=typeof position!="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesRead=stream.stream_ops.read(stream,buffer,offset,length,position);if(!seeking)stream.position+=bytesRead;return bytesRead},write(stream,buffer,offset,length,position,canOwn){if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.write){throw new FS.ErrnoError(28)}if(stream.seekable&&stream.flags&1024){FS.llseek(stream,0,2)}var seeking=typeof position!="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesWritten=stream.stream_ops.write(stream,buffer,offset,length,position,canOwn);if(!seeking)stream.position+=bytesWritten;return bytesWritten},mmap(stream,length,position,prot,flags){if((prot&2)!==0&&(flags&2)===0&&(stream.flags&2097155)!==2){throw new FS.ErrnoError(2)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(2)}if(!stream.stream_ops.mmap){throw new FS.ErrnoError(43)}if(!length){throw new FS.ErrnoError(28)}return stream.stream_ops.mmap(stream,length,position,prot,flags)},msync(stream,buffer,offset,length,mmapFlags){if(!stream.stream_ops.msync){return 0}return stream.stream_ops.msync(stream,buffer,offset,length,mmapFlags)},ioctl(stream,cmd,arg){if(!stream.stream_ops.ioctl){throw new FS.ErrnoError(59)}return stream.stream_ops.ioctl(stream,cmd,arg)},readFile(path,opts={}){opts.flags=opts.flags||0;opts.encoding=opts.encoding||"binary";if(opts.encoding!=="utf8"&&opts.encoding!=="binary"){abort(`Invalid encoding type "${opts.encoding}"`)}var stream=FS.open(path,opts.flags);var stat=FS.stat(path);var length=stat.size;var buf=new Uint8Array(length);FS.read(stream,buf,0,length,0);if(opts.encoding==="utf8"){buf=UTF8ArrayToString(buf)}FS.close(stream);return buf},writeFile(path,data,opts={}){opts.flags=opts.flags||577;var stream=FS.open(path,opts.flags,opts.mode);if(typeof data=="string"){data=new Uint8Array(intArrayFromString(data,true))}if(ArrayBuffer.isView(data)){FS.write(stream,data,0,data.byteLength,undefined,opts.canOwn)}else{abort("Unsupported data type")}FS.close(stream)},cwd:()=>FS.currentPath,chdir(path){var lookup=FS.lookupPath(path,{follow:true});if(lookup.node===null){throw new FS.ErrnoError(44)}if(!FS.isDir(lookup.node.mode)){throw new FS.ErrnoError(54)}var errCode=FS.nodePermissions(lookup.node,"x");if(errCode){throw new FS.ErrnoError(errCode)}FS.currentPath=lookup.path},createDefaultDirectories(){FS.mkdir("/tmp");FS.mkdir("/home");FS.mkdir("/home/web_user")},createDefaultDevices(){FS.mkdir("/dev");FS.registerDevice(FS.makedev(1,3),{read:()=>0,write:(stream,buffer,offset,length,pos)=>length,llseek:()=>0});FS.mkdev("/dev/null",FS.makedev(1,3));TTY.register(FS.makedev(5,0),TTY.default_tty_ops);TTY.register(FS.makedev(6,0),TTY.default_tty1_ops);FS.mkdev("/dev/tty",FS.makedev(5,0));FS.mkdev("/dev/tty1",FS.makedev(6,0));var randomBuffer=new Uint8Array(1024),randomLeft=0;var randomByte=()=>{if(randomLeft===0){randomFill(randomBuffer);randomLeft=randomBuffer.byteLength}return randomBuffer[--randomLeft]};FS.createDevice("/dev","random",randomByte);FS.createDevice("/dev","urandom",randomByte);FS.mkdir("/dev/shm");FS.mkdir("/dev/shm/tmp")},createSpecialDirectories(){FS.mkdir("/proc");var proc_self=FS.mkdir("/proc/self");FS.mkdir("/proc/self/fd");FS.mount({mount(){var node=FS.createNode(proc_self,"fd",16895,73);node.stream_ops={llseek:MEMFS.stream_ops.llseek};node.node_ops={lookup(parent,name){var fd=+name;var stream=FS.getStreamChecked(fd);var ret={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>stream.path},id:fd+1};ret.parent=ret;return ret},readdir(){return Array.from(FS.streams.entries()).filter(([k,v])=>v).map(([k,v])=>k.toString())}};return node}},{},"/proc/self/fd")},createStandardStreams(input,output,error){if(input){FS.createDevice("/dev","stdin",input)}else{FS.symlink("/dev/tty","/dev/stdin")}if(output){FS.createDevice("/dev","stdout",null,output)}else{FS.symlink("/dev/tty","/dev/stdout")}if(error){FS.createDevice("/dev","stderr",null,error)}else{FS.symlink("/dev/tty1","/dev/stderr")}var stdin=FS.open("/dev/stdin",0);var stdout=FS.open("/dev/stdout",1);var stderr=FS.open("/dev/stderr",1)},staticInit(){FS.nameTable=new Array(4096);FS.mount(MEMFS,{},"/");FS.createDefaultDirectories();FS.createDefaultDevices();FS.createSpecialDirectories();FS.filesystems={MEMFS}},init(input,output,error){FS.initialized=true;input??=Module["stdin"];output??=Module["stdout"];error??=Module["stderr"];FS.createStandardStreams(input,output,error)},quit(){FS.initialized=false;for(var stream of FS.streams){if(stream){FS.close(stream)}}},findObject(path,dontResolveLastLink){var ret=FS.analyzePath(path,dontResolveLastLink);if(!ret.exists){return null}return ret.object},analyzePath(path,dontResolveLastLink){try{var lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});path=lookup.path}catch(e){}var ret={isRoot:false,exists:false,error:0,name:null,path:null,object:null,parentExists:false,parentPath:null,parentObject:null};try{var lookup=FS.lookupPath(path,{parent:true});ret.parentExists=true;ret.parentPath=lookup.path;ret.parentObject=lookup.node;ret.name=PATH.basename(path);lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});ret.exists=true;ret.path=lookup.path;ret.object=lookup.node;ret.name=lookup.node.name;ret.isRoot=lookup.path==="/"}catch(e){ret.error=e.errno}return ret},createPath(parent,path,canRead,canWrite){parent=typeof parent=="string"?parent:FS.getPath(parent);var parts=path.split("/").reverse();while(parts.length){var part=parts.pop();if(!part)continue;var current=PATH.join2(parent,part);try{FS.mkdir(current)}catch(e){if(e.errno!=20)throw e}parent=current}return current},createFile(parent,name,properties,canRead,canWrite){var path=PATH.join2(typeof parent=="string"?parent:FS.getPath(parent),name);var mode=FS_getMode(canRead,canWrite);return FS.create(path,mode)},createDataFile(parent,name,data,canRead,canWrite,canOwn){var path=name;if(parent){parent=typeof parent=="string"?parent:FS.getPath(parent);path=name?PATH.join2(parent,name):parent}var mode=FS_getMode(canRead,canWrite);var node=FS.create(path,mode);if(data){if(typeof data=="string"){var arr=new Array(data.length);for(var i=0,len=data.length;i<len;++i)arr[i]=data.charCodeAt(i);data=arr}FS.chmod(node,mode|146);var stream=FS.open(node,577);FS.write(stream,data,0,data.length,0,canOwn);FS.close(stream);FS.chmod(node,mode)}},createDevice(parent,name,input,output){var path=PATH.join2(typeof parent=="string"?parent:FS.getPath(parent),name);var mode=FS_getMode(!!input,!!output);FS.createDevice.major??=64;var dev=FS.makedev(FS.createDevice.major++,0);FS.registerDevice(dev,{open(stream){stream.seekable=false},close(stream){if(output?.buffer?.length){output(10)}},read(stream,buffer,offset,length,pos){var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=input()}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.atime=Date.now()}return bytesRead},write(stream,buffer,offset,length,pos){for(var i=0;i<length;i++){try{output(buffer[offset+i])}catch(e){throw new FS.ErrnoError(29)}}if(length){stream.node.mtime=stream.node.ctime=Date.now()}return i}});return FS.mkdev(path,mode,dev)},forceLoadFile(obj){if(obj.isDevice||obj.isFolder||obj.link||obj.contents)return true;if(globalThis.XMLHttpRequest){abort("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")}else{try{obj.contents=readBinary(obj.url)}catch(e){throw new FS.ErrnoError(29)}}},createLazyFile(parent,name,url,canRead,canWrite){class LazyUint8Array{lengthKnown=false;chunks=[];get(idx){if(idx>this.length-1||idx<0){return undefined}var chunkOffset=idx%this.chunkSize;var chunkNum=idx/this.chunkSize|0;return this.getter(chunkNum)[chunkOffset]}setDataGetter(getter){this.getter=getter}cacheLength(){var xhr=new XMLHttpRequest;xhr.open("HEAD",url,false);xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))abort("Couldn't load "+url+". Status: "+xhr.status);var datalength=Number(xhr.getResponseHeader("Content-length"));var header;var hasByteServing=(header=xhr.getResponseHeader("Accept-Ranges"))&&header==="bytes";var usesGzip=(header=xhr.getResponseHeader("Content-Encoding"))&&header==="gzip";var chunkSize=1024*1024;if(!hasByteServing)chunkSize=datalength;var doXHR=(from,to)=>{if(from>to)abort("invalid range ("+from+", "+to+") or no bytes requested!");if(to>datalength-1)abort("only "+datalength+" bytes available! programmer error!");var xhr=new XMLHttpRequest;xhr.open("GET",url,false);if(datalength!==chunkSize)xhr.setRequestHeader("Range","bytes="+from+"-"+to);xhr.responseType="arraybuffer";if(xhr.overrideMimeType){xhr.overrideMimeType("text/plain; charset=x-user-defined")}xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))abort("Couldn't load "+url+". Status: "+xhr.status);if(xhr.response!==undefined){return new Uint8Array(xhr.response||[])}return intArrayFromString(xhr.responseText||"",true)};var lazyArray=this;lazyArray.setDataGetter(chunkNum=>{var start=chunkNum*chunkSize;var end=(chunkNum+1)*chunkSize-1;end=Math.min(end,datalength-1);if(typeof lazyArray.chunks[chunkNum]=="undefined"){lazyArray.chunks[chunkNum]=doXHR(start,end)}if(typeof lazyArray.chunks[chunkNum]=="undefined")abort("doXHR failed!");return lazyArray.chunks[chunkNum]});if(usesGzip||!datalength){chunkSize=datalength=1;datalength=this.getter(0).length;chunkSize=datalength;out("LazyFiles on gzip forces download of the whole file when length is accessed")}this._length=datalength;this._chunkSize=chunkSize;this.lengthKnown=true}get length(){if(!this.lengthKnown){this.cacheLength()}return this._length}get chunkSize(){if(!this.lengthKnown){this.cacheLength()}return this._chunkSize}}if(globalThis.XMLHttpRequest){if(!ENVIRONMENT_IS_WORKER)abort("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var lazyArray=new LazyUint8Array;var properties={isDevice:false,contents:lazyArray}}else{var properties={isDevice:false,url}}var node=FS.createFile(parent,name,properties,canRead,canWrite);if(properties.contents){node.contents=properties.contents}else if(properties.url){node.contents=null;node.url=properties.url}Object.defineProperties(node,{usedBytes:{get:function(){return this.contents.length}}});var stream_ops={};var keys=Object.keys(node.stream_ops);keys.forEach(key=>{var fn=node.stream_ops[key];stream_ops[key]=(...args)=>{FS.forceLoadFile(node);return fn(...args)}});function writeChunks(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=contents.length)return 0;var size=Math.min(contents.length-position,length);if(contents.slice){for(var i=0;i<size;i++){buffer[offset+i]=contents[position+i]}}else{for(var i=0;i<size;i++){buffer[offset+i]=contents.get(position+i)}}return size}stream_ops.read=(stream,buffer,offset,length,position)=>{FS.forceLoadFile(node);return writeChunks(stream,buffer,offset,length,position)};stream_ops.mmap=(stream,length,position,prot,flags)=>{FS.forceLoadFile(node);var ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}writeChunks(stream,HEAP8,ptr,length,position);return{ptr,allocated:true}};node.stream_ops=stream_ops;return node}};var UTF8ToString=(ptr,maxBytesToRead,ignoreNul)=>ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead,ignoreNul):"";var SYSCALLS={DEFAULT_POLLMASK:5,calculateAt(dirfd,path,allowEmpty){if(PATH.isAbs(path)){return path}var dir;if(dirfd===-100){dir=FS.cwd()}else{var dirstream=SYSCALLS.getStreamFromFD(dirfd);dir=dirstream.path}if(path.length==0){if(!allowEmpty){throw new FS.ErrnoError(44)}return dir}return dir+"/"+path},writeStat(buf,stat){HEAPU32[buf>>2]=stat.dev;HEAPU32[buf+4>>2]=stat.mode;HEAPU32[buf+8>>2]=stat.nlink;HEAPU32[buf+12>>2]=stat.uid;HEAPU32[buf+16>>2]=stat.gid;HEAPU32[buf+20>>2]=stat.rdev;HEAP64[buf+24>>3]=BigInt(stat.size);HEAP32[buf+32>>2]=4096;HEAP32[buf+36>>2]=stat.blocks;var atime=stat.atime.getTime();var mtime=stat.mtime.getTime();var ctime=stat.ctime.getTime();HEAP64[buf+40>>3]=BigInt(Math.floor(atime/1e3));HEAPU32[buf+48>>2]=atime%1e3*1e3*1e3;HEAP64[buf+56>>3]=BigInt(Math.floor(mtime/1e3));HEAPU32[buf+64>>2]=mtime%1e3*1e3*1e3;HEAP64[buf+72>>3]=BigInt(Math.floor(ctime/1e3));HEAPU32[buf+80>>2]=ctime%1e3*1e3*1e3;HEAP64[buf+88>>3]=BigInt(stat.ino);return 0},writeStatFs(buf,stats){HEAPU32[buf+4>>2]=stats.bsize;HEAPU32[buf+60>>2]=stats.bsize;HEAP64[buf+8>>3]=BigInt(stats.blocks);HEAP64[buf+16>>3]=BigInt(stats.bfree);HEAP64[buf+24>>3]=BigInt(stats.bavail);HEAP64[buf+32>>3]=BigInt(stats.files);HEAP64[buf+40>>3]=BigInt(stats.ffree);HEAPU32[buf+48>>2]=stats.fsid;HEAPU32[buf+64>>2]=stats.flags;HEAPU32[buf+56>>2]=stats.namelen},doMsync(addr,stream,len,flags,offset){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}if(flags&2){return 0}var buffer=HEAPU8.slice(addr,addr+len);FS.msync(stream,buffer,offset,len,flags)},getStreamFromFD(fd){var stream=FS.getStreamChecked(fd);return stream},varargs:undefined,getStr(ptr){var ret=UTF8ToString(ptr);return ret}};function ___syscall_fcntl64(fd,cmd,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(cmd){case 0:{var arg=syscallGetVarargI();if(arg<0){return-28}while(FS.streams[arg]){arg++}var newStream;newStream=FS.dupStream(stream,arg);return newStream.fd}case 1:case 2:return 0;case 3:return stream.flags;case 4:{var arg=syscallGetVarargI();stream.flags|=arg;return 0}case 12:{var arg=syscallGetVarargP();var offset=0;HEAP16[arg+offset>>1]=2;return 0}case 13:case 14:return 0}return-28}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_ioctl(fd,op,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(op){case 21509:{if(!stream.tty)return-59;return 0}case 21505:{if(!stream.tty)return-59;if(stream.tty.ops.ioctl_tcgets){var termios=stream.tty.ops.ioctl_tcgets(stream);var argp=syscallGetVarargP();HEAP32[argp>>2]=termios.c_iflag||0;HEAP32[argp+4>>2]=termios.c_oflag||0;HEAP32[argp+8>>2]=termios.c_cflag||0;HEAP32[argp+12>>2]=termios.c_lflag||0;for(var i=0;i<32;i++){HEAP8[argp+i+17]=termios.c_cc[i]||0}return 0}return 0}case 21510:case 21511:case 21512:{if(!stream.tty)return-59;return 0}case 21506:case 21507:case 21508:{if(!stream.tty)return-59;if(stream.tty.ops.ioctl_tcsets){var argp=syscallGetVarargP();var c_iflag=HEAP32[argp>>2];var c_oflag=HEAP32[argp+4>>2];var c_cflag=HEAP32[argp+8>>2];var c_lflag=HEAP32[argp+12>>2];var c_cc=[];for(var i=0;i<32;i++){c_cc.push(HEAP8[argp+i+17])}return stream.tty.ops.ioctl_tcsets(stream.tty,op,{c_iflag,c_oflag,c_cflag,c_lflag,c_cc})}return 0}case 21519:{if(!stream.tty)return-59;var argp=syscallGetVarargP();HEAP32[argp>>2]=0;return 0}case 21520:{if(!stream.tty)return-59;return-28}case 21537:case 21531:{var argp=syscallGetVarargP();return FS.ioctl(stream,op,argp)}case 21523:{if(!stream.tty)return-59;if(stream.tty.ops.ioctl_tiocgwinsz){var winsize=stream.tty.ops.ioctl_tiocgwinsz(stream.tty);var argp=syscallGetVarargP();HEAP16[argp>>1]=winsize[0];HEAP16[argp+2>>1]=winsize[1]}return 0}case 21524:{if(!stream.tty)return-59;return 0}case 21515:{if(!stream.tty)return-59;return 0}default:return-28}}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_openat(dirfd,path,flags,varargs){SYSCALLS.varargs=varargs;try{path=SYSCALLS.getStr(path);path=SYSCALLS.calculateAt(dirfd,path);var mode=varargs?syscallGetVarargI():0;return FS.open(path,flags,mode).fd}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}function ___syscall_stat64(path,buf){try{path=SYSCALLS.getStr(path);return SYSCALLS.writeStat(buf,FS.stat(path))}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return-e.errno}}var getHeapMax=()=>268435456;var alignMemory=(size,alignment)=>Math.ceil(size/alignment)*alignment;var growMemory=size=>{var oldHeapSize=wasmMemory.buffer.byteLength;var pages=(size-oldHeapSize+65535)/65536|0;try{wasmMemory.grow(pages);updateMemoryViews();return 1}catch(e){}};var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;requestedSize>>>=0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignMemory(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=growMemory(newSize);if(replacement){return true}}return false};function _fd_close(fd){try{var stream=SYSCALLS.getStreamFromFD(fd);FS.close(stream);return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var doReadv=(stream,iov,iovcnt,offset)=>{var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>2];var len=HEAPU32[iov+4>>2];iov+=8;var curr=FS.read(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len)break;if(typeof offset!="undefined"){offset+=curr}}return ret};function _fd_read(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=doReadv(stream,iov,iovcnt);HEAPU32[pnum>>2]=num;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var INT53_MAX=9007199254740992;var INT53_MIN=-9007199254740992;var bigintToI53Checked=num=>num<INT53_MIN||num>INT53_MAX?NaN:Number(num);function _fd_seek(fd,offset,whence,newOffset){offset=bigintToI53Checked(offset);try{if(isNaN(offset))return 61;var stream=SYSCALLS.getStreamFromFD(fd);FS.llseek(stream,offset,whence);HEAP64[newOffset>>3]=BigInt(stream.position);if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var doWritev=(stream,iov,iovcnt,offset)=>{var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAPU32[iov>>2];var len=HEAPU32[iov+4>>2];iov+=8;var curr=FS.write(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len){break}if(typeof offset!="undefined"){offset+=curr}}return ret};function _fd_write(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=doWritev(stream,iov,iovcnt);HEAPU32[pnum>>2]=num;return 0}catch(e){if(typeof FS=="undefined"||!(e.name==="ErrnoError"))throw e;return e.errno}}var getCFunc=ident=>{var func=Module["_"+ident];return func};var writeArrayToMemory=(array,buffer)=>{HEAP8.set(array,buffer)};var stringToUTF8=(str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite);var stackAlloc=sz=>__emscripten_stack_alloc(sz);var stringToUTF8OnStack=str=>{var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8(str,ret,size);return ret};var ccall=(ident,returnType,argTypes,args,opts)=>{var toC={string:str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){ret=stringToUTF8OnStack(str)}return ret},array:arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func(...cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret};var cwrap=(ident,returnType,argTypes,opts)=>{var numericArgs=!argTypes||argTypes.every(type=>type==="number"||type==="boolean");var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return(...args)=>ccall(ident,returnType,argTypes,args,opts)};var wasmTableMirror=[];var getWasmTableEntry=funcPtr=>{var func=wasmTableMirror[funcPtr];if(!func){wasmTableMirror[funcPtr]=func=wasmTable.get(funcPtr)}return func};var updateTableMap=(offset,count)=>{if(functionsInTableMap){for(var i=offset;i<offset+count;i++){var item=getWasmTableEntry(i);if(item){functionsInTableMap.set(item,i)}}}};var functionsInTableMap;var getFunctionAddress=func=>{if(!functionsInTableMap){functionsInTableMap=new WeakMap;updateTableMap(0,wasmTable.length)}return functionsInTableMap.get(func)||0};var freeTableIndexes=[];var getEmptyTableSlot=()=>{if(freeTableIndexes.length){return freeTableIndexes.pop()}return wasmTable["grow"](1)};var setWasmTableEntry=(idx,func)=>{wasmTable.set(idx,func);wasmTableMirror[idx]=wasmTable.get(idx)};var uleb128EncodeWithLen=arr=>{const n=arr.length;return[n%128|128,n>>7,...arr]};var wasmTypeCodes={i:127,p:127,j:126,f:125,d:124,e:111};var generateTypePack=types=>uleb128EncodeWithLen(Array.from(types,type=>{var code=wasmTypeCodes[type];return code}));var convertJsFunctionToWasm=(func,sig)=>{var bytes=Uint8Array.of(0,97,115,109,1,0,0,0,1,...uleb128EncodeWithLen([1,96,...generateTypePack(sig.slice(1)),...generateTypePack(sig[0]==="v"?"":sig[0])]),2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0);var module=new WebAssembly.Module(bytes);var instance=new WebAssembly.Instance(module,{e:{f:func}});var wrappedFunc=instance.exports["f"];return wrappedFunc};var addFunction=(func,sig)=>{var rtn=getFunctionAddress(func);if(rtn){return rtn}var ret=getEmptyTableSlot();try{setWasmTableEntry(ret,func)}catch(err){if(!(err instanceof TypeError)){throw err}var wrapped=convertJsFunctionToWasm(func,sig);setWasmTableEntry(ret,wrapped)}functionsInTableMap.set(func,ret);return ret};var removeFunction=index=>{functionsInTableMap.delete(getWasmTableEntry(index));setWasmTableEntry(index,null);freeTableIndexes.push(index)};FS.createPreloadedFile=FS_createPreloadedFile;FS.preloadFile=FS_preloadFile;FS.staticInit();{if(Module["noExitRuntime"])noExitRuntime=Module["noExitRuntime"];if(Module["preloadPlugins"])preloadPlugins=Module["preloadPlugins"];if(Module["print"])out=Module["print"];if(Module["printErr"])err=Module["printErr"];if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].shift()()}}}Module["ccall"]=ccall;Module["cwrap"]=cwrap;Module["addFunction"]=addFunction;Module["removeFunction"]=removeFunction;Module["setValue"]=setValue;Module["getValue"]=getValue;Module["UTF8ToString"]=UTF8ToString;Module["stringToUTF8"]=stringToUTF8;Module["lengthBytesUTF8"]=lengthBytesUTF8;Module["FS"]=FS;var _retro_api_version,_retro_set_video_refresh,_retro_set_audio_sample,_retro_set_audio_sample_batch,_retro_set_input_poll,_retro_set_input_state,_retro_set_controller_port_device,_retro_set_environment,_retro_get_system_info,_retro_get_system_av_info,_retro_init,_retro_deinit,_retro_reset,_retro_run,_retro_serialize_size,_retro_serialize,_retro_unserialize,_retro_cheat_reset,_retro_cheat_set,_retro_load_game,_retro_get_region,_retro_unload_game,_romdev_vramwatch_set,_romdev_vramwatch_get,_romdev_setreg,_romdev_getreg,_retro_get_memory_data,_retro_get_memory_size,_romdev_watchpoint_set,_romdev_watchpoint_set_cond,_romdev_watchpoint_get,_romdev_readwatch_set,_romdev_readwatch_get,_romdev_cheat_set,_romdev_cheat_get,_romdev_cheat_read,_romdev_range_set,_romdev_range_get,_romdev_pcbreak_set,_romdev_pcbreak_get,_romdev_watchdog_set,_romdev_cov_set,_romdev_covbits_set,_romdev_covbits_get,_romdev_cov_get,_romdev_regsnap_get,_romdev_irqblock_set,_romdev_trace_set,_romdev_trace_info,_romdev_trace_regs,_malloc,_free,__emscripten_stack_restore,__emscripten_stack_alloc,_emscripten_stack_get_current,memory,__indirect_function_table,wasmMemory,wasmTable;function assignWasmExports(wasmExports){_retro_api_version=Module["_retro_api_version"]=wasmExports["l"];_retro_set_video_refresh=Module["_retro_set_video_refresh"]=wasmExports["m"];_retro_set_audio_sample=Module["_retro_set_audio_sample"]=wasmExports["n"];_retro_set_audio_sample_batch=Module["_retro_set_audio_sample_batch"]=wasmExports["o"];_retro_set_input_poll=Module["_retro_set_input_poll"]=wasmExports["p"];_retro_set_input_state=Module["_retro_set_input_state"]=wasmExports["q"];_retro_set_controller_port_device=Module["_retro_set_controller_port_device"]=wasmExports["r"];_retro_set_environment=Module["_retro_set_environment"]=wasmExports["s"];_retro_get_system_info=Module["_retro_get_system_info"]=wasmExports["t"];_retro_get_system_av_info=Module["_retro_get_system_av_info"]=wasmExports["u"];_retro_init=Module["_retro_init"]=wasmExports["v"];_retro_deinit=Module["_retro_deinit"]=wasmExports["w"];_retro_reset=Module["_retro_reset"]=wasmExports["x"];_retro_run=Module["_retro_run"]=wasmExports["y"];_retro_serialize_size=Module["_retro_serialize_size"]=wasmExports["z"];_retro_serialize=Module["_retro_serialize"]=wasmExports["A"];_retro_unserialize=Module["_retro_unserialize"]=wasmExports["B"];_retro_cheat_reset=Module["_retro_cheat_reset"]=wasmExports["C"];_retro_cheat_set=Module["_retro_cheat_set"]=wasmExports["D"];_retro_load_game=Module["_retro_load_game"]=wasmExports["E"];_retro_get_region=Module["_retro_get_region"]=wasmExports["F"];_retro_unload_game=Module["_retro_unload_game"]=wasmExports["G"];_romdev_vramwatch_set=Module["_romdev_vramwatch_set"]=wasmExports["H"];_romdev_vramwatch_get=Module["_romdev_vramwatch_get"]=wasmExports["I"];_romdev_setreg=Module["_romdev_setreg"]=wasmExports["J"];_romdev_getreg=Module["_romdev_getreg"]=wasmExports["K"];_retro_get_memory_data=Module["_retro_get_memory_data"]=wasmExports["L"];_retro_get_memory_size=Module["_retro_get_memory_size"]=wasmExports["M"];_romdev_watchpoint_set=Module["_romdev_watchpoint_set"]=wasmExports["N"];_romdev_watchpoint_set_cond=Module["_romdev_watchpoint_set_cond"]=wasmExports["O"];_romdev_watchpoint_get=Module["_romdev_watchpoint_get"]=wasmExports["P"];_romdev_readwatch_set=Module["_romdev_readwatch_set"]=wasmExports["Q"];_romdev_readwatch_get=Module["_romdev_readwatch_get"]=wasmExports["R"];_romdev_cheat_set=Module["_romdev_cheat_set"]=wasmExports["S"];_romdev_cheat_get=Module["_romdev_cheat_get"]=wasmExports["T"];_romdev_cheat_read=Module["_romdev_cheat_read"]=wasmExports["U"];_romdev_range_set=Module["_romdev_range_set"]=wasmExports["V"];_romdev_range_get=Module["_romdev_range_get"]=wasmExports["W"];_romdev_pcbreak_set=Module["_romdev_pcbreak_set"]=wasmExports["X"];_romdev_pcbreak_get=Module["_romdev_pcbreak_get"]=wasmExports["Y"];_romdev_watchdog_set=Module["_romdev_watchdog_set"]=wasmExports["Z"];_romdev_cov_set=Module["_romdev_cov_set"]=wasmExports["_"];_romdev_covbits_set=Module["_romdev_covbits_set"]=wasmExports["$"];_romdev_covbits_get=Module["_romdev_covbits_get"]=wasmExports["aa"];_romdev_cov_get=Module["_romdev_cov_get"]=wasmExports["ba"];_romdev_regsnap_get=Module["_romdev_regsnap_get"]=wasmExports["ca"];_romdev_irqblock_set=Module["_romdev_irqblock_set"]=wasmExports["da"];_romdev_trace_set=Module["_romdev_trace_set"]=wasmExports["ea"];_romdev_trace_info=Module["_romdev_trace_info"]=wasmExports["fa"];_romdev_trace_regs=Module["_romdev_trace_regs"]=wasmExports["ga"];_malloc=Module["_malloc"]=wasmExports["ha"];_free=Module["_free"]=wasmExports["ia"];__emscripten_stack_restore=wasmExports["ja"];__emscripten_stack_alloc=wasmExports["ka"];_emscripten_stack_get_current=wasmExports["la"];memory=wasmMemory=wasmExports["j"];__indirect_function_table=wasmTable=wasmExports["ma"]}var wasmImports={d:___syscall_fcntl64,g:___syscall_ioctl,h:___syscall_openat,e:___syscall_stat64,i:_emscripten_resize_heap,a:_fd_close,b:_fd_read,f:_fd_seek,c:_fd_write};function run(){if(runDependencies>0){dependenciesFulfilled=run;return}preRun();if(runDependencies>0){dependenciesFulfilled=run;return}function doRun(){Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve?.(Module);Module["onRuntimeInitialized"]?.();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(()=>{setTimeout(()=>Module["setStatus"](""),1);doRun()},1)}else{doRun()}}var wasmExports;wasmExports=await (createWasm());run();if(runtimeInitialized){moduleRtn=Module}else{moduleRtn=new Promise((resolve,reject)=>{readyPromiseResolve=resolve;readyPromiseReject=reject})}
;return moduleRtn}

const LegacyCore = (function() { const module = { exports: {} }; const exports = module.exports; const require = null;
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var preferredFrameRate = 60;
    var CPU_FREQ_NTSC = 1789772.5;
    var APU = /** @class */ (function () {
        function APU(cpu, onAudioSample) {
            this.cpu = cpu;
            this.onAudioSample = onAudioSample;
            this.square1 = new ChannelSquare(this, true);
            this.square2 = new ChannelSquare(this, false);
            this.triangle = new ChannelTriangle(this);
            this.noise = new ChannelNoise(this);
            this.dmc = new ChannelDM(this);
            this.frameIrqCounterMax = 4;
            this.initCounter = 2048;
            this.sampleRate = 44100;
            this.lengthLookup = null;
            this.dmcFreqLookup = null;
            this.noiseWavelengthLookup = null;
            this.square_table = null;
            this.tnd_table = null;
            this.frameIrqEnabled = false;
            this.frameIrqActive = false;
            this.startedPlaying = false;
            this.recordOutput = false;
            this.initingHardware = false;
            this.masterFrameCounter = 0;
            this.derivedFrameCounter = 0;
            this.countSequence = 0;
            this.sampleTimer = 0;
            this.frameTime = Math.floor((14915.0 * preferredFrameRate) / 60.0);
            this.sampleTimerMax = Math.floor((1024.0 * CPU_FREQ_NTSC * preferredFrameRate) / (this.sampleRate * 60.0));
            this.sampleCount = 0;
            this.triValue = 0;
            this.accCount = 0;
            this.smpSquare1 = 0;
            this.smpSquare2 = 0;
            this.smpTriangle = 0;
            this.smpDmc = 0;
            this.prevSample = 0;
            this.smpAccum = 0;
            this.dacRange = 0;
            this.dcValue = 0;
            this.masterVolume = 256;
            this.posSquare1 = null;
            this.posSquare2 = null;
            this.posTriangle = null;
            this.posNoise = null;
            this.posDMC = null;
            this.extraCycles = null;
            this.maxSample = -500000;
            this.minSample = 500000;
            this.panning = [80, 170, 100, 150, 128];
            this.setPanning(this.panning);
            this.initLengthLookup();
            this.initDmcFrequencyLookup();
            this.initNoiseWavelengthLookup();
            this.initDACtables();
            for (var i = 0; i < 0x14; i++) {
                if (i === 0x10) {
                    this.writeReg(0x4010, 0x10);
                }
                else {
                    this.writeReg(0x4000 + i, 0);
                }
            }
            this.updateChannelEnable(0);
        }
        APU.prototype.readReg = function (address) {
            var tmp = 0;
            tmp |= (this.square1.getLengthStatus());
            tmp |= (this.square2.getLengthStatus() << 1);
            tmp |= (this.triangle.getLengthStatus() << 2);
            tmp |= (this.noise.getLengthStatus() << 3);
            tmp |= (this.dmc.getLengthStatus() << 4);
            tmp |= (((this.frameIrqActive && this.frameIrqEnabled) ? 1 : 0) << 6);
            tmp |= (this.dmc.getIrqStatus() << 7);
            this.frameIrqActive = false;
            this.dmc.irqGenerated = false;
            return tmp & 0xFFFF;
        };
        APU.prototype.writeReg = function (address, value) {
            if (address >= 0x4000 && address < 0x4004) {
                this.square1.writeReg(address, value);
            }
            else if (address >= 0x4004 && address < 0x4008) {
                this.square2.writeReg(address, value);
            }
            else if (address >= 0x4008 && address < 0x400C) {
                this.triangle.writeReg(address, value);
            }
            else if (address >= 0x400C && address <= 0x400F) {
                this.noise.writeReg(address, value);
            }
            else if (address === 0x4010) {
                this.dmc.writeReg(address, value);
            }
            else if (address === 0x4011) {
                this.dmc.writeReg(address, value);
            }
            else if (address === 0x4012) {
                this.dmc.writeReg(address, value);
            }
            else if (address === 0x4013) {
                this.dmc.writeReg(address, value);
            }
            else if (address === 0x4015) {
                this.updateChannelEnable(value);
                if (value !== 0 && this.initCounter > 0) {
                    this.initingHardware = true;
                }
                this.dmc.writeReg(address, value);
            }
            else if (address === 0x4017) {
                this.countSequence = (value >> 7) & 1;
                this.masterFrameCounter = 0;
                this.frameIrqActive = false;
                if (((value >> 6) & 0x1) === 0) {
                    this.frameIrqEnabled = true;
                }
                else {
                    this.frameIrqEnabled = false;
                }
                if (this.countSequence === 0) {
                    this.frameIrqCounterMax = 4;
                    this.derivedFrameCounter = 4;
                }
                else {
                    this.frameIrqCounterMax = 5;
                    this.derivedFrameCounter = 0;
                    this.frameCounterTick();
                }
            }
        };
        APU.prototype.updateChannelEnable = function (value) {
            this.channelEnableValue = value & 0xFFFF;
            this.square1.setEnabled((value & 1) !== 0);
            this.square2.setEnabled((value & 2) !== 0);
            this.triangle.setEnabled((value & 4) !== 0);
            this.noise.setEnabled((value & 8) !== 0);
            this.dmc.setEnabled((value & 16) !== 0);
        };
        APU.prototype.clockFrameCounter = function (nCycles) {
            if (this.initCounter > 0) {
                if (this.initingHardware) {
                    this.initCounter -= nCycles;
                    if (this.initCounter <= 0) {
                        this.initingHardware = false;
                    }
                    return;
                }
            }
            nCycles += this.extraCycles;
            var maxCycles = this.sampleTimerMax - this.sampleTimer;
            if ((nCycles << 10) > maxCycles) {
                this.extraCycles = ((nCycles << 10) - maxCycles) >> 10;
                nCycles -= this.extraCycles;
            }
            else {
                this.extraCycles = 0;
            }
            var dmc = this.dmc;
            var triangle = this.triangle;
            var square1 = this.square1;
            var square2 = this.square2;
            var noise = this.noise;
            if (dmc.isEnabled) {
                dmc.shiftCounter -= (nCycles << 3);
                while (dmc.shiftCounter <= 0 && dmc.dmaFrequency > 0) {
                    dmc.shiftCounter += dmc.dmaFrequency;
                    dmc.clockDmc();
                }
            }
            if (triangle.progTimerMax > 0) {
                triangle.progTimerCount -= nCycles;
                while (triangle.progTimerCount <= 0) {
                    triangle.progTimerCount += triangle.progTimerMax + 1;
                    if (triangle.linearCounter > 0 && triangle.lengthCounter > 0) {
                        triangle.triangleCounter++;
                        triangle.triangleCounter &= 0x1F;
                        if (triangle.isEnabled) {
                            if (triangle.triangleCounter >= 0x10) {
                                triangle.sampleValue = (triangle.triangleCounter & 0xF);
                            }
                            else {
                                triangle.sampleValue = (0xF - (triangle.triangleCounter & 0xF));
                            }
                            triangle.sampleValue <<= 4;
                        }
                    }
                }
            }
            square1.progTimerCount -= nCycles;
            if (square1.progTimerCount <= 0) {
                square1.progTimerCount += (square1.progTimerMax + 1) << 1;
                square1.squareCounter++;
                square1.squareCounter &= 0x7;
                square1.updateSampleValue();
            }
            square2.progTimerCount -= nCycles;
            if (square2.progTimerCount <= 0) {
                square2.progTimerCount += (square2.progTimerMax + 1) << 1;
                square2.squareCounter++;
                square2.squareCounter &= 0x7;
                square2.updateSampleValue();
            }
            var acc_c = nCycles;
            if (noise.progTimerCount - acc_c > 0) {
                noise.progTimerCount -= acc_c;
                noise.accCount += acc_c;
                noise.accValue += acc_c * noise.sampleValue;
            }
            else {
                while ((acc_c--) > 0) {
                    if (--noise.progTimerCount <= 0 && noise.progTimerMax > 0) {
                        noise.shiftReg <<= 1;
                        noise.tmp = (((noise.shiftReg << (noise.randomMode === 0 ? 1 : 6)) ^ noise.shiftReg) & 0x8000);
                        if (noise.tmp !== 0) {
                            noise.shiftReg |= 0x01;
                            noise.randomBit = 0;
                            noise.sampleValue = 0;
                        }
                        else {
                            noise.randomBit = 1;
                            if (noise.isEnabled && noise.lengthCounter > 0) {
                                noise.sampleValue = noise.masterVolume;
                            }
                            else {
                                noise.sampleValue = 0;
                            }
                        }
                        noise.progTimerCount += noise.progTimerMax;
                    }
                    noise.accValue += noise.sampleValue;
                    noise.accCount++;
                }
            }
            if (this.frameIrqEnabled && this.frameIrqActive) {
                this.cpu.requestIrq(InstructionRequest.NORMAL);
            }
            this.masterFrameCounter += (nCycles << 1);
            if (this.masterFrameCounter >= this.frameTime) {
                this.masterFrameCounter -= this.frameTime;
                this.frameCounterTick();
            }
            this.accSample(nCycles);
            this.sampleTimer += nCycles << 10;
            if (this.sampleTimer >= this.sampleTimerMax) {
                this.sample();
                this.sampleTimer -= this.sampleTimerMax;
            }
        };
        APU.prototype.accSample = function (cycles) {
            if (this.triangle.sampleCondition) {
                this.triValue = Math.floor((this.triangle.progTimerCount << 4) /
                    (this.triangle.progTimerMax + 1));
                if (this.triValue > 16) {
                    this.triValue = 16;
                }
                if (this.triangle.triangleCounter >= 16) {
                    this.triValue = 16 - this.triValue;
                }
                this.triValue += this.triangle.sampleValue;
            }
            if (cycles === 2) {
                this.smpTriangle += this.triValue << 1;
                this.smpDmc += this.dmc.sample << 1;
                this.smpSquare1 += this.square1.sampleValue << 1;
                this.smpSquare2 += this.square2.sampleValue << 1;
                this.accCount += 2;
            }
            else if (cycles === 4) {
                this.smpTriangle += this.triValue << 2;
                this.smpDmc += this.dmc.sample << 2;
                this.smpSquare1 += this.square1.sampleValue << 2;
                this.smpSquare2 += this.square2.sampleValue << 2;
                this.accCount += 4;
            }
            else {
                this.smpTriangle += cycles * this.triValue;
                this.smpDmc += cycles * this.dmc.sample;
                this.smpSquare1 += cycles * this.square1.sampleValue;
                this.smpSquare2 += cycles * this.square2.sampleValue;
                this.accCount += cycles;
            }
        };
        APU.prototype.frameCounterTick = function () {
            this.derivedFrameCounter++;
            if (this.derivedFrameCounter >= this.frameIrqCounterMax) {
                this.derivedFrameCounter = 0;
            }
            if (this.derivedFrameCounter === 1 || this.derivedFrameCounter === 3) {
                this.triangle.clockLengthCounter();
                this.square1.clockLengthCounter();
                this.square2.clockLengthCounter();
                this.noise.clockLengthCounter();
                this.square1.clockSweep();
                this.square2.clockSweep();
            }
            if (this.derivedFrameCounter >= 0 && this.derivedFrameCounter < 4) {
                this.square1.clockEnvDecay();
                this.square2.clockEnvDecay();
                this.noise.clockEnvDecay();
                this.triangle.clockLinearCounter();
            }
            if (this.derivedFrameCounter === 3 && this.countSequence === 0) {
                this.frameIrqActive = true;
            }
        };
        APU.prototype.sample = function () {
            var sq_index, tnd_index;
            if (this.accCount > 0) {
                this.smpSquare1 <<= 4;
                this.smpSquare1 = Math.floor(this.smpSquare1 / this.accCount);
                this.smpSquare2 <<= 4;
                this.smpSquare2 = Math.floor(this.smpSquare2 / this.accCount);
                this.smpTriangle = Math.floor(this.smpTriangle / this.accCount);
                this.smpDmc <<= 4;
                this.smpDmc = Math.floor(this.smpDmc / this.accCount);
                this.accCount = 0;
            }
            else {
                this.smpSquare1 = this.square1.sampleValue << 4;
                this.smpSquare2 = this.square2.sampleValue << 4;
                this.smpTriangle = this.triangle.sampleValue;
                this.smpDmc = this.dmc.sample << 4;
            }
            var smpNoise = Math.floor((this.noise.accValue << 4) /
                this.noise.accCount);
            this.noise.accValue = smpNoise >> 4;
            this.noise.accCount = 1;
            sq_index = (this.smpSquare1 * this.posSquare1 +
                this.smpSquare2 * this.posSquare2) >> 8;
            tnd_index = (3 * this.smpTriangle * this.posTriangle +
                (smpNoise << 1) * this.posNoise + this.smpDmc *
                this.posDMC) >> 8;
            if (sq_index >= this.square_table.length) {
                sq_index = this.square_table.length - 1;
            }
            if (tnd_index >= this.tnd_table.length) {
                tnd_index = this.tnd_table.length - 1;
            }
            var sampleValue = this.square_table[sq_index] +
                this.tnd_table[tnd_index] - this.dcValue;
            var smpDiffL = sampleValue - this.prevSample;
            this.prevSample += smpDiffL;
            this.smpAccum += smpDiffL - (this.smpAccum >> 10);
            sampleValue = this.smpAccum;
            if (sampleValue > this.maxSample) {
                this.maxSample = sampleValue;
            }
            if (sampleValue < this.minSample) {
                this.minSample = sampleValue;
            }
            this.onAudioSample(sampleValue / 32768);
            this.smpSquare1 = 0;
            this.smpSquare2 = 0;
            this.smpTriangle = 0;
            this.smpDmc = 0;
        };
        APU.prototype.getLengthMax = function (value) {
            return this.lengthLookup[value >> 3];
        };
        APU.prototype.getDmcFrequency = function (value) {
            if (value >= 0 && value < 0x10) {
                return this.dmcFreqLookup[value];
            }
            return 0;
        };
        APU.prototype.getNoiseWaveLength = function (value) {
            if (value >= 0 && value < 0x10) {
                return this.noiseWavelengthLookup[value];
            }
            return 0;
        };
        APU.prototype.setPanning = function (pos) {
            for (var i = 0; i < 5; i++) {
                this.panning[i] = pos[i];
            }
            this.updateStereoPos();
        };
        APU.prototype.setMasterVolume = function (value) {
            if (value < 0) {
                value = 0;
            }
            if (value > 256) {
                value = 256;
            }
            this.masterVolume = value;
            this.updateStereoPos();
        };
        APU.prototype.updateStereoPos = function () {
            this.posSquare1 = (this.panning[0] * this.masterVolume) >> 8;
            this.posSquare2 = (this.panning[1] * this.masterVolume) >> 8;
            this.posTriangle = (this.panning[2] * this.masterVolume) >> 8;
            this.posNoise = (this.panning[3] * this.masterVolume) >> 8;
            this.posDMC = (this.panning[4] * this.masterVolume) >> 8;
        };
        APU.prototype.initLengthLookup = function () {
            this.lengthLookup = [
                0x0A, 0xFE,
                0x14, 0x02,
                0x28, 0x04,
                0x50, 0x06,
                0xA0, 0x08,
                0x3C, 0x0A,
                0x0E, 0x0C,
                0x1A, 0x0E,
                0x0C, 0x10,
                0x18, 0x12,
                0x30, 0x14,
                0x60, 0x16,
                0xC0, 0x18,
                0x48, 0x1A,
                0x10, 0x1C,
                0x20, 0x1E
            ];
        };
        APU.prototype.initDmcFrequencyLookup = function () {
            this.dmcFreqLookup = new Array(16);
            this.dmcFreqLookup[0x0] = 0xD60;
            this.dmcFreqLookup[0x1] = 0xBE0;
            this.dmcFreqLookup[0x2] = 0xAA0;
            this.dmcFreqLookup[0x3] = 0xA00;
            this.dmcFreqLookup[0x4] = 0x8F0;
            this.dmcFreqLookup[0x5] = 0x7F0;
            this.dmcFreqLookup[0x6] = 0x710;
            this.dmcFreqLookup[0x7] = 0x6B0;
            this.dmcFreqLookup[0x8] = 0x5F0;
            this.dmcFreqLookup[0x9] = 0x500;
            this.dmcFreqLookup[0xA] = 0x470;
            this.dmcFreqLookup[0xB] = 0x400;
            this.dmcFreqLookup[0xC] = 0x350;
            this.dmcFreqLookup[0xD] = 0x2A0;
            this.dmcFreqLookup[0xE] = 0x240;
            this.dmcFreqLookup[0xF] = 0x1B0;
        };
        APU.prototype.initNoiseWavelengthLookup = function () {
            this.noiseWavelengthLookup = new Array(16);
            this.noiseWavelengthLookup[0x0] = 0x004;
            this.noiseWavelengthLookup[0x1] = 0x008;
            this.noiseWavelengthLookup[0x2] = 0x010;
            this.noiseWavelengthLookup[0x3] = 0x020;
            this.noiseWavelengthLookup[0x4] = 0x040;
            this.noiseWavelengthLookup[0x5] = 0x060;
            this.noiseWavelengthLookup[0x6] = 0x080;
            this.noiseWavelengthLookup[0x7] = 0x0A0;
            this.noiseWavelengthLookup[0x8] = 0x0CA;
            this.noiseWavelengthLookup[0x9] = 0x0FE;
            this.noiseWavelengthLookup[0xA] = 0x17C;
            this.noiseWavelengthLookup[0xB] = 0x1FC;
            this.noiseWavelengthLookup[0xC] = 0x2FA;
            this.noiseWavelengthLookup[0xD] = 0x3F8;
            this.noiseWavelengthLookup[0xE] = 0x7F2;
            this.noiseWavelengthLookup[0xF] = 0xFE4;
        };
        APU.prototype.initDACtables = function () {
            var value, ival, i;
            var max_sqr = 0;
            var max_tnd = 0;
            this.square_table = new Array(32 * 16);
            this.tnd_table = new Array(204 * 16);
            for (i = 0; i < 32 * 16; i++) {
                value = 95.52 / (8128.0 / (i / 16.0) + 100.0);
                value *= 0.98411;
                value *= 50000.0;
                ival = Math.floor(value);
                this.square_table[i] = ival;
                if (ival > max_sqr) {
                    max_sqr = ival;
                }
            }
            for (i = 0; i < 204 * 16; i++) {
                value = 163.67 / (24329.0 / (i / 16.0) + 100.0);
                value *= 0.98411;
                value *= 50000.0;
                ival = Math.floor(value);
                this.tnd_table[i] = ival;
                if (ival > max_tnd) {
                    max_tnd = ival;
                }
            }
            this.dacRange = max_sqr + max_tnd;
            this.dcValue = this.dacRange / 2;
        };
        return APU;
    }());
    var PlayMode;
    (function (PlayMode) {
        PlayMode[PlayMode["NORMAL"] = 0] = "NORMAL";
        PlayMode[PlayMode["LOOP"] = 1] = "LOOP";
        PlayMode[PlayMode["IRQ"] = 2] = "IRQ";
    })(PlayMode || (PlayMode = {}));
    var ChannelDM = /** @class */ (function () {
        function ChannelDM(apu) {
            this.apu = apu;
            this.isEnabled = false;
            this.hasSample = false;
            this.irqGenerated = false;
            this.playMode = PlayMode.NORMAL;
            this.dmaFrequency = 0;
            this.dmaCounter = 0;
            this.deltaCounter = 0;
            this.playStartAddress = 0;
            this.playAddress = 0;
            this.playLength = 0;
            this.playLengthCounter = 0;
            this.sample = 0;
            this.dacLsb = 0;
            this.shiftCounter = 0;
            this.reg4012 = 0;
            this.reg4013 = 0;
            this.data = 0;
        }
        ChannelDM.prototype.clockDmc = function () {
            if (this.hasSample) {
                if ((this.data & 1) === 0) {
                    if (this.deltaCounter > 0) {
                        this.deltaCounter--;
                    }
                }
                else {
                    if (this.deltaCounter < 63) {
                        this.deltaCounter++;
                    }
                }
                this.sample = this.isEnabled ? (this.deltaCounter << 1) + this.dacLsb : 0;
                this.data >>= 1;
            }
            this.dmaCounter--;
            if (this.dmaCounter <= 0) {
                this.hasSample = false;
                this.endOfSample();
                this.dmaCounter = 8;
            }
            if (this.irqGenerated) {
                this.apu.cpu.requestIrq(InstructionRequest.NORMAL);
            }
        };
        ChannelDM.prototype.endOfSample = function () {
            if (this.playLengthCounter === 0 && this.playMode === PlayMode.LOOP) {
                this.playAddress = this.playStartAddress;
                this.playLengthCounter = this.playLength;
            }
            if (this.playLengthCounter > 0) {
                this.nextSample();
                if (this.playLengthCounter === 0) {
                    if (this.playMode === PlayMode.IRQ) {
                        this.irqGenerated = true;
                    }
                }
            }
        };
        ChannelDM.prototype.nextSample = function () {
            this.data = this.apu.cpu.mapper.load(this.playAddress);
            this.apu.cpu.haltCycles(4);
            this.playLengthCounter--;
            this.playAddress++;
            if (this.playAddress > 0xFFFF) {
                this.playAddress = 0x8000;
            }
            this.hasSample = true;
        };
        ChannelDM.prototype.writeReg = function (address, value) {
            if (address === 0x4010) {
                if ((value >> 6) === 0) {
                    this.playMode = PlayMode.NORMAL;
                }
                else if (((value >> 6) & 1) === 1) {
                    this.playMode = PlayMode.LOOP;
                }
                else if ((value >> 6) === 2) {
                    this.playMode = PlayMode.IRQ;
                }
                if ((value & 0x80) === 0) {
                    this.irqGenerated = false;
                }
                this.dmaFrequency = this.apu.getDmcFrequency(value & 0xF);
            }
            else if (address === 0x4011) {
                this.deltaCounter = (value >> 1) & 63;
                this.dacLsb = value & 1;
                this.sample = ((this.deltaCounter << 1) + this.dacLsb);
            }
            else if (address === 0x4012) {
                this.playStartAddress = (value << 6) | 0x0C000;
                this.playAddress = this.playStartAddress;
                this.reg4012 = value;
            }
            else if (address === 0x4013) {
                this.playLength = (value << 4) + 1;
                this.playLengthCounter = this.playLength;
                this.reg4013 = value;
            }
            else if (address === 0x4015) {
                if (((value >> 4) & 1) === 0) {
                    this.playLengthCounter = 0;
                }
                else {
                    this.playAddress = this.playStartAddress;
                    this.playLengthCounter = this.playLength;
                }
                this.irqGenerated = false;
            }
        };
        ChannelDM.prototype.setEnabled = function (value) {
            if ((!this.isEnabled) && value) {
                this.playLengthCounter = this.playLength;
            }
            this.isEnabled = value;
        };
        ChannelDM.prototype.getLengthStatus = function () {
            return ((this.playLengthCounter === 0 || !this.isEnabled) ? 0 : 1);
        };
        ChannelDM.prototype.getIrqStatus = function () {
            return (this.irqGenerated ? 1 : 0);
        };
        return ChannelDM;
    }());
    var ChannelNoise = /** @class */ (function () {
        function ChannelNoise(apu) {
            this.apu = apu;
            this.progTimerCount = 0;
            this.progTimerMax = 0;
            this.isEnabled = false;
            this.lengthCounter = 0;
            this.lengthCounterEnable = false;
            this.envReset = false;
            this.envDecayDisable = false;
            this.envDecayLoopEnable = false;
            this.shiftNow = false;
            this.envDecayRate = 0;
            this.envDecayCounter = 0;
            this.envVolume = 0;
            this.masterVolume = 0;
            this.shiftReg = 1;
            this.randomBit = 0;
            this.randomMode = 0;
            this.sampleValue = 0;
            this.accValue = 0;
            this.accCount = 1;
            this.tmp = 0;
        }
        ChannelNoise.prototype.clockLengthCounter = function () {
            if (this.lengthCounterEnable && this.lengthCounter > 0) {
                this.lengthCounter--;
                if (this.lengthCounter === 0) {
                    this.updateSampleValue();
                }
            }
        };
        ChannelNoise.prototype.clockEnvDecay = function () {
            if (this.envReset) {
                this.envReset = false;
                this.envDecayCounter = this.envDecayRate + 1;
                this.envVolume = 0xF;
            }
            else if (--this.envDecayCounter <= 0) {
                this.envDecayCounter = this.envDecayRate + 1;
                if (this.envVolume > 0) {
                    this.envVolume--;
                }
                else {
                    this.envVolume = this.envDecayLoopEnable ? 0xF : 0;
                }
            }
            this.masterVolume = this.envDecayDisable ? this.envDecayRate : this.envVolume;
            this.updateSampleValue();
        };
        ChannelNoise.prototype.updateSampleValue = function () {
            if (this.isEnabled && this.lengthCounter > 0) {
                this.sampleValue = this.randomBit * this.masterVolume;
            }
        };
        ChannelNoise.prototype.writeReg = function (address, value) {
            if (address === 0x400C) {
                this.envDecayDisable = ((value & 0x10) !== 0);
                this.envDecayRate = value & 0xF;
                this.envDecayLoopEnable = ((value & 0x20) !== 0);
                this.lengthCounterEnable = ((value & 0x20) === 0);
                this.masterVolume = this.envDecayDisable ? this.envDecayRate : this.envVolume;
            }
            else if (address === 0x400E) {
                this.progTimerMax = this.apu.getNoiseWaveLength(value & 0xF);
                this.randomMode = value >> 7;
            }
            else if (address === 0x400F) {
                this.lengthCounter = this.apu.getLengthMax(value & 248);
                this.envReset = true;
            }
        };
        ChannelNoise.prototype.setEnabled = function (value) {
            this.isEnabled = value;
            if (!value) {
                this.lengthCounter = 0;
            }
            this.updateSampleValue();
        };
        ChannelNoise.prototype.getLengthStatus = function () {
            return ((this.lengthCounter === 0 || !this.isEnabled) ? 0 : 1);
        };
        return ChannelNoise;
    }());
    var ChannelSquare = /** @class */ (function () {
        function ChannelSquare(apu, sqr1) {
            this.apu = apu;
            this.sqr1 = sqr1;
            this.dutyLookup = [
                0, 1, 0, 0, 0, 0, 0, 0,
                0, 1, 1, 0, 0, 0, 0, 0,
                0, 1, 1, 1, 1, 0, 0, 0,
                1, 0, 0, 1, 1, 1, 1, 1
            ];
            this.impLookup = [
                1, -1, 0, 0, 0, 0, 0, 0,
                1, 0, -1, 0, 0, 0, 0, 0,
                1, 0, 0, 0, -1, 0, 0, 0,
                -1, 0, 1, 0, 0, 0, 0, 0
            ];
            this.progTimerCount = 0;
            this.progTimerMax = 0;
            this.lengthCounter = 0;
            this.squareCounter = 0;
            this.sweepCounter = 0;
            this.sweepCounterMax = 0;
            this.sweepMode = 0;
            this.sweepShiftAmount = 0;
            this.envReset = false;
            this.envDecayRate = 0;
            this.envDecayCounter = 0;
            this.envVolume = 0;
            this.masterVolume = 0;
            this.dutyMode = 0;
            this.vol = 0;
            this.isEnabled = false;
            this.lengthCounterEnable = false;
            this.sweepActive = false;
            this.sweepCarry = false;
            this.updateSweepPeriod = false;
            this.envDecayDisable = false;
            this.envDecayLoopEnable = false;
        }
        ChannelSquare.prototype.clockLengthCounter = function () {
            if (this.lengthCounterEnable && this.lengthCounter > 0) {
                this.lengthCounter -= 1;
                if (this.lengthCounter === 0) {
                    this.updateSampleValue();
                }
            }
        };
        ChannelSquare.prototype.clockEnvDecay = function () {
            if (this.envReset) {
                this.envReset = false;
                this.envDecayCounter = this.envDecayRate + 1;
                this.envVolume = 0xF;
            }
            else if ((--this.envDecayCounter) <= 0) {
                this.envDecayCounter = this.envDecayRate + 1;
                if (this.envVolume > 0) {
                    this.envVolume -= 1;
                }
                else {
                    this.envVolume = this.envDecayLoopEnable ? 0xF : 0;
                }
            }
            this.masterVolume = this.envDecayDisable ? this.envDecayRate : this.envVolume;
            this.updateSampleValue();
        };
        ChannelSquare.prototype.clockSweep = function () {
            this.sweepCounter -= 1;
            if (this.sweepCounter <= 0) {
                this.sweepCounter = this.sweepCounterMax + 1;
                if (this.sweepActive && this.sweepShiftAmount > 0 && this.progTimerMax > 7) {
                    this.sweepCarry = false;
                    if (this.sweepMode === 0) {
                        this.progTimerMax += (this.progTimerMax >> this.sweepShiftAmount);
                        if (this.progTimerMax > 4095) {
                            this.progTimerMax = 4095;
                            this.sweepCarry = true;
                        }
                    }
                    else {
                        this.progTimerMax = this.progTimerMax - ((this.progTimerMax >> this.sweepShiftAmount) - (this.sqr1 ? 1 : 0));
                    }
                }
            }
            if (this.updateSweepPeriod) {
                this.updateSweepPeriod = false;
                this.sweepCounter = this.sweepCounterMax + 1;
            }
        };
        ChannelSquare.prototype.updateSampleValue = function () {
            if (this.isEnabled && this.lengthCounter > 0 && this.progTimerMax > 7) {
                if (this.sweepMode === 0 && (this.progTimerMax + (this.progTimerMax >> this.sweepShiftAmount)) > 4095) {
                    this.sampleValue = 0;
                }
                else {
                    this.sampleValue = this.masterVolume * this.dutyLookup[(this.dutyMode << 3) + this.squareCounter];
                }
            }
            else {
                this.sampleValue = 0;
            }
        };
        ChannelSquare.prototype.writeReg = function (address, value) {
            var addrAdd = (this.sqr1 ? 0 : 4);
            if (address === 0x4000 + addrAdd) {
                this.envDecayDisable = ((value & 0x10) !== 0);
                this.envDecayRate = value & 0xF;
                this.envDecayLoopEnable = ((value & 0x20) !== 0);
                this.dutyMode = (value >> 6) & 0x3;
                this.lengthCounterEnable = ((value & 0x20) === 0);
                this.masterVolume = this.envDecayDisable ? this.envDecayRate : this.envVolume;
                this.updateSampleValue();
            }
            else if (address === 0x4001 + addrAdd) {
                this.sweepActive = ((value & 0x80) !== 0);
                this.sweepCounterMax = ((value >> 4) & 7);
                this.sweepMode = (value >> 3) & 1;
                this.sweepShiftAmount = value & 7;
                this.updateSweepPeriod = true;
            }
            else if (address === 0x4002 + addrAdd) {
                this.progTimerMax &= 0x700;
                this.progTimerMax |= value;
            }
            else if (address === 0x4003 + addrAdd) {
                this.progTimerMax &= 0xFF;
                this.progTimerMax |= ((value & 0x7) << 8);
                if (this.isEnabled) {
                    this.lengthCounter = this.apu.getLengthMax(value & 0xF8);
                }
                this.envReset = true;
            }
        };
        ChannelSquare.prototype.setEnabled = function (value) {
            this.isEnabled = value;
            if (!value) {
                this.lengthCounter = 0;
            }
            this.updateSampleValue();
        };
        ChannelSquare.prototype.getLengthStatus = function () {
            return ((this.lengthCounter === 0 || !this.isEnabled) ? 0 : 1);
        };
        return ChannelSquare;
    }());
    var ChannelTriangle = /** @class */ (function () {
        function ChannelTriangle(apu) {
            this.apu = apu;
            this.progTimerCount = 0;
            this.progTimerMax = 0;
            this.triangleCounter = 0;
            this.isEnabled = false;
            this.sampleCondition = false;
            this.lengthCounter = 0;
            this.lengthCounterEnable = false;
            this.linearCounter = 0;
            this.lcLoadValue = 0;
            this.lcHalt = true;
            this.lcControl = false;
            this.tmp = 0;
            this.sampleValue = 0xF;
        }
        ChannelTriangle.prototype.clockLengthCounter = function () {
            if (this.lengthCounterEnable && this.lengthCounter > 0) {
                this.lengthCounter -= 1;
                if (this.lengthCounter === 0) {
                    this.updateSampleCondition();
                }
            }
        };
        ChannelTriangle.prototype.clockLinearCounter = function () {
            if (this.lcHalt) {
                this.linearCounter = this.lcLoadValue;
                this.updateSampleCondition();
            }
            else if (this.linearCounter > 0) {
                this.linearCounter -= 1;
                this.updateSampleCondition();
            }
            if (!this.lcControl) {
                this.lcHalt = false;
            }
        };
        ChannelTriangle.prototype.getLengthStatus = function () {
            return ((this.lengthCounter === 0 || !this.isEnabled) ? 0 : 1);
        };
        ChannelTriangle.prototype.readReg = function (address) {
            return 0;
        };
        ChannelTriangle.prototype.writeReg = function (address, value) {
            if (address === 0x4008) {
                this.lcControl = (value & 0x80) !== 0;
                this.lcLoadValue = value & 0x7F;
                this.lengthCounterEnable = !this.lcControl;
            }
            else if (address === 0x400A) {
                this.progTimerMax &= 0x700;
                this.progTimerMax |= value;
            }
            else if (address === 0x400B) {
                this.progTimerMax &= 0xFF;
                this.progTimerMax |= ((value & 0x07) << 8);
                this.lengthCounter = this.apu.getLengthMax(value & 0xF8);
                this.lcHalt = true;
            }
            this.updateSampleCondition();
        };
        ChannelTriangle.prototype.clockProgrammableTimer = function (nCycles) {
            if (this.progTimerMax > 0) {
                this.progTimerCount += nCycles;
                while (this.progTimerMax > 0 &&
                    this.progTimerCount >= this.progTimerMax) {
                    this.progTimerCount -= this.progTimerMax;
                    if (this.isEnabled && this.lengthCounter > 0 &&
                        this.linearCounter > 0) {
                        this.clockTriangleGenerator();
                    }
                }
            }
        };
        ChannelTriangle.prototype.clockTriangleGenerator = function () {
            this.triangleCounter += 1;
            this.triangleCounter &= 0x1F;
        };
        ChannelTriangle.prototype.setEnabled = function (value) {
            this.isEnabled = value;
            if (!value) {
                this.lengthCounter = 0;
            }
            this.updateSampleCondition();
        };
        ChannelTriangle.prototype.updateSampleCondition = function () {
            this.sampleCondition = this.isEnabled &&
                this.progTimerMax > 7 &&
                this.linearCounter > 0 &&
                this.lengthCounter > 0;
        };
        return ChannelTriangle;
    }());
    /* export */ var Speaker = /** @class */ (function () {
        function Speaker() {
            this.buffer = [];
        }
        Speaker.prototype.close = function () {
            if (this.processor) {
                this.processor.disconnect(this.context.destination);
                this.processor = null;
            }
            if (this.context) {
                this.context.close();
                this.context = null;
            }
        };
        Speaker.prototype.push = function (sample) {
            if (this.proccessorReady()) {
                var samples = Array.isArray(sample) ? sample : [sample];
                for (var i = 0; i < samples.length; i += 1) {
                    this.buffer.push(samples[i]);
                }
            }
        };
        Speaker.prototype.play = function (samples) {
            if (this.contextReady()) {
                var buffer = this.context.createBuffer(1, samples.length, this.context.sampleRate);
                var channel = buffer.getChannelData(0);
                for (var i = 0; i < samples.length; i += 1) {
                    channel[i] = samples[i];
                }
                var source = this.context.createBufferSource();
                source.buffer = buffer;
                source.connect(this.context.destination);
                source.start();
            }
        };
        Speaker.prototype.onaudioprocess = function (event) {
            var chanel = event.outputBuffer.getChannelData(0);
            if (this.onbufferunderrun && this.buffer.length < chanel.length) {
                this.onbufferunderrun(this.buffer.length, chanel.length);
            }
            while (this.buffer.length > chanel.length * 2) {
                this.buffer = this.buffer.slice(chanel.length);
            }
            var size = Math.min(this.buffer.length, chanel.length);
            for (var i = 0; i < size; i++) {
                chanel[i] = this.buffer[i];
            }
            this.buffer = this.buffer.slice(size);
        };
        Speaker.prototype.contextReady = function () {
            if (this.context) {
                return true;
            }
            else if (window) {
                var AudioContext_1 = window.AudioContext || window.webkitAudioContext;
                if (AudioContext_1) {
                    this.context = new AudioContext_1();
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        };
        Speaker.prototype.proccessorReady = function () {
            if (this.processor) {
                return true;
            }
            else if (this.contextReady()) {
                this.buffer = [];
                this.processor = this.context.createScriptProcessor(1024, 1, 1);
                this.processor.onaudioprocess = this.onaudioprocess.bind(this);
                this.processor.connect(this.context.destination);
            }
            else {
                return false;
            }
        };
        return Speaker;
    }());
    exports.Speaker = Speaker;
    var ControllerButtonKey;
    (function (ControllerButtonKey) {
        ControllerButtonKey[ControllerButtonKey["a"] = 0] = "a";
        ControllerButtonKey[ControllerButtonKey["b"] = 1] = "b";
        ControllerButtonKey[ControllerButtonKey["select"] = 2] = "select";
        ControllerButtonKey[ControllerButtonKey["start"] = 3] = "start";
        ControllerButtonKey[ControllerButtonKey["up"] = 4] = "up";
        ControllerButtonKey[ControllerButtonKey["down"] = 5] = "down";
        ControllerButtonKey[ControllerButtonKey["left"] = 6] = "left";
        ControllerButtonKey[ControllerButtonKey["right"] = 7] = "right";
    })(ControllerButtonKey || (ControllerButtonKey = {}));
    var ControllerButtonState;
    (function (ControllerButtonState) {
        ControllerButtonState[ControllerButtonState["down"] = 65] = "down";
        ControllerButtonState[ControllerButtonState["up"] = 64] = "up";
    })(ControllerButtonState || (ControllerButtonState = {}));
    function tickJoycon(joycon, key) {
        if (joycon.turbo[key]) {
            if (joycon.firing[key]) {
                joycon.state[key] = joycon.state[key] === ControllerButtonState.down
                    ? ControllerButtonState.up
                    : ControllerButtonState.down;
            }
            else {
                joycon.firing[key] = true;
                joycon.state[key] = ControllerButtonState.down;
            }
        }
        else if (joycon.firing[key]) {
            joycon.firing[key] = false;
            joycon.state[key] = ControllerButtonState.up;
        }
    }
    var Controller = /** @class */ (function () {
        function Controller() {
            this.tickedOn = 0;
            this.p1 = {
                state: [],
                turbo: {},
                firing: {}
            };
            this.p2 = {
                state: [],
                turbo: {},
                firing: {}
            };
            this.buttonMaps = {
                a: { key: ControllerButtonKey.a, turbo: false },
                A: { key: ControllerButtonKey.a, turbo: true },
                b: { key: ControllerButtonKey.b, turbo: false },
                B: { key: ControllerButtonKey.b, turbo: true },
                select: { key: ControllerButtonKey.select, turbo: false },
                start: { key: ControllerButtonKey.start, turbo: false },
                u: { key: ControllerButtonKey.up, turbo: false },
                d: { key: ControllerButtonKey.down, turbo: false },
                l: { key: ControllerButtonKey.left, turbo: false },
                r: { key: ControllerButtonKey.right, turbo: false }
            };
            for (var i = 0; i < 8; i += 1) {
                this.state1[i] = ControllerButtonState.up;
                this.state1[i] = ControllerButtonState.up;
                this.p1.turbo[i] = false;
                this.p2.firing[i] = false;
            }
        }
        Object.defineProperty(Controller.prototype, "state1", {
            get: function () {
                return this.p1.state;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Controller.prototype, "state2", {
            get: function () {
                return this.p2.state;
            },
            enumerable: true,
            configurable: true
        });
        Controller.prototype.frame = function () {
            var now = Date.now();
            if (now - this.tickedOn > 50) {
                for (var i = 0; i < 8; i += 1) {
                    tickJoycon(this.p1, i);
                    tickJoycon(this.p2, i);
                }
                this.tickedOn = now;
            }
        };
        Controller.prototype.buttonDown = function (player, button) {
            var m = this.buttonMaps[button];
            if (!m) {
                return;
            }
            if (player === 1) {
                if (m.turbo) {
                    this.p1.turbo[m.key] = true;
                }
                else {
                    this.p1.state[m.key] = ControllerButtonState.down;
                }
            }
            else if (player === 2) {
                if (m.turbo) {
                    this.p2.turbo[m.key] = true;
                }
                else {
                    this.p2.state[m.key] = ControllerButtonState.down;
                }
            }
        };
        Controller.prototype.buttonUp = function (player, button) {
            var m = this.buttonMaps[button];
            if (!m) {
                return;
            }
            if (player === 1) {
                if (m.turbo) {
                    this.p1.turbo[m.key] = false;
                }
                else {
                    this.p1.state[m.key] = ControllerButtonState.up;
                }
            }
            else if (player === 2) {
                if (m.turbo) {
                    this.p2.turbo[m.key] = false;
                }
                else {
                    this.p2.state[m.key] = ControllerButtonState.up;
                }
            }
        };
        return Controller;
    }());
    var InstructionRequest;
    (function (InstructionRequest) {
        InstructionRequest[InstructionRequest["NORMAL"] = 0] = "NORMAL";
        InstructionRequest[InstructionRequest["NMI"] = 1] = "NMI";
        InstructionRequest[InstructionRequest["RESET"] = 2] = "RESET";
    })(InstructionRequest || (InstructionRequest = {}));
    var CPU = /** @class */ (function () {
        function CPU(mapper) {
            this.mapper = mapper;
            this.mem = new Array(0x10000);
            for (var i = 0; i < 0x2000; i += 1) {
                this.mem[i] = 0xFF;
            }
            for (var i = 0; i < 4; i += 1) {
                var offset = i * 0x800;
                this.mem[offset + 0x008] = 0xF7;
                this.mem[offset + 0x009] = 0xEF;
                this.mem[offset + 0x00A] = 0xDF;
                this.mem[offset + 0x00F] = 0xBF;
            }
            for (var i = 0x2001; i < this.mem.length; i += 1) {
                this.mem[i] = 0;
            }
            this.REG_ACC = 0;
            this.REG_X = 0;
            this.REG_Y = 0;
            this.REG_SP = 0x01FF;
            this.REG_PC = 0x8000 - 1;
            this.REG_PC_NEW = 0x8000 - 1;
            this.REG_STATUS = 0x28;
            this.setStatus(0x28);
            this.F_CARRY = 0;
            this.F_DECIMAL = 0;
            this.F_INTERRUPT = 1;
            this.F_INTERRUPT_NEW = 1;
            this.F_OVERFLOW = 0;
            this.F_SIGN = 0;
            this.F_ZERO = 1;
            this.F_NOTUSED = 1;
            this.F_NOTUSED_NEW = 1;
            this.F_BRK = 1;
            this.F_BRK_NEW = 1;
            this.cyclesToHalt = 0;
            this.crash = false;
            this.irqRequested = false;
            this.irqType = null;
        }
        Object.defineProperty(CPU.prototype, "serializable", {
            get: function () {
                return CPU.serializable;
            },
            enumerable: true,
            configurable: true
        });
        CPU.prototype.emulate = function () {
            var temp;
            var add;
            // VRC4 IRQ is level-triggered and remains asserted until acknowledged.
            if (this.mapper.irqPending) {
                this.requestIrq(InstructionRequest.NORMAL);
            }
            if (this.irqRequested) {
                temp =
                    (this.F_CARRY) |
                        ((this.F_ZERO === 0 ? 1 : 0) << 1) |
                        (this.F_INTERRUPT << 2) |
                        (this.F_DECIMAL << 3) |
                        (this.F_BRK << 4) |
                        (this.F_NOTUSED << 5) |
                        (this.F_OVERFLOW << 6) |
                        (this.F_SIGN << 7);
                this.REG_PC_NEW = this.REG_PC;
                this.F_INTERRUPT_NEW = this.F_INTERRUPT;
                switch (this.irqType) {
                    case 0: {
                        if (this.F_INTERRUPT != 0) {
                            break;
                        }
                        this.doIrq(temp);
                        break;
                    }
                    case 1: {
                        this.doNonMaskableInterrupt(temp);
                        break;
                    }
                    case 2: {
                        this.doResetInterrupt();
                        break;
                    }
                }
                this.REG_PC = this.REG_PC_NEW;
                this.F_INTERRUPT = this.F_INTERRUPT_NEW;
                this.F_BRK = this.F_BRK_NEW;
                this.irqRequested = false;
            }
            var opinf = Operation.opdata[this.mapper.load(this.REG_PC + 1)];
            var cycleCount = (opinf >> 24);
            var cycleAdd = 0;
            var addrMode = (opinf >> 8) & 0xFF;
            var opaddr = this.REG_PC;
            this.REG_PC += ((opinf >> 16) & 0xFF);
            var addr = 0;
            switch (addrMode) {
                case 0: {
                    addr = this.load(opaddr + 2);
                    break;
                }
                case 1: {
                    addr = this.load(opaddr + 2);
                    if (addr < 0x80) {
                        addr += this.REG_PC;
                    }
                    else {
                        addr += this.REG_PC - 256;
                    }
                    break;
                }
                case 2: {
                    break;
                }
                case 3: {
                    addr = this.load16bit(opaddr + 2);
                    break;
                }
                case 4: {
                    addr = this.REG_ACC;
                    break;
                }
                case 5: {
                    addr = this.REG_PC;
                    break;
                }
                case 6: {
                    addr = (this.load(opaddr + 2) + this.REG_X) & 0xFF;
                    break;
                }
                case 7: {
                    addr = (this.load(opaddr + 2) + this.REG_Y) & 0xFF;
                    break;
                }
                case 8: {
                    addr = this.load16bit(opaddr + 2);
                    if ((addr & 0xFF00) != ((addr + this.REG_X) & 0xFF00)) {
                        cycleAdd = 1;
                    }
                    addr += this.REG_X;
                    break;
                }
                case 9: {
                    addr = this.load16bit(opaddr + 2);
                    if ((addr & 0xFF00) != ((addr + this.REG_Y) & 0xFF00)) {
                        cycleAdd = 1;
                    }
                    addr += this.REG_Y;
                    break;
                }
                case 10: {
                    addr = this.load(opaddr + 2);
                    if ((addr & 0xFF00) != ((addr + this.REG_X) & 0xFF00)) {
                        cycleAdd = 1;
                    }
                    addr += this.REG_X;
                    addr &= 0xFF;
                    addr = this.load16bit(addr);
                    break;
                }
                case 11: {
                    addr = this.load16bit(this.load(opaddr + 2));
                    if ((addr & 0xFF00) != ((addr + this.REG_Y) & 0xFF00)) {
                        cycleAdd = 1;
                    }
                    addr += this.REG_Y;
                    break;
                }
                case 12: {
                    addr = this.load16bit(opaddr + 2);
                    if (addr < 0x1FFF) {
                        addr = this.mem[addr] + (this.mem[(addr & 0xFF00) | (((addr & 0xFF) + 1) & 0xFF)] << 8);
                    }
                    else {
                        addr = this.mapper.load(addr) + (this.mapper.load((addr & 0xFF00) | (((addr & 0xFF) + 1) & 0xFF)) << 8);
                    }
                    break;
                }
            }
            addr &= 0xFFFF;
            switch (opinf & 0xFF) {
                case 0: {
                    temp = this.REG_ACC + this.load(addr) + this.F_CARRY;
                    this.F_OVERFLOW = ((!(((this.REG_ACC ^ this.load(addr)) & 0x80) != 0) && (((this.REG_ACC ^ temp) & 0x80)) != 0) ? 1 : 0);
                    this.F_CARRY = (temp > 255 ? 1 : 0);
                    this.F_SIGN = (temp >> 7) & 1;
                    this.F_ZERO = temp & 0xFF;
                    this.REG_ACC = (temp & 255);
                    cycleCount += cycleAdd;
                    break;
                }
                case 1: {
                    this.REG_ACC = this.REG_ACC & this.load(addr);
                    this.F_SIGN = (this.REG_ACC >> 7) & 1;
                    this.F_ZERO = this.REG_ACC;
                    if (addrMode != 11)
                        cycleCount += cycleAdd;
                    break;
                }
                case 2: {
                    if (addrMode == 4) {
                        this.F_CARRY = (this.REG_ACC >> 7) & 1;
                        this.REG_ACC = (this.REG_ACC << 1) & 255;
                        this.F_SIGN = (this.REG_ACC >> 7) & 1;
                        this.F_ZERO = this.REG_ACC;
                    }
                    else {
                        temp = this.load(addr);
                        this.F_CARRY = (temp >> 7) & 1;
                        temp = (temp << 1) & 255;
                        this.F_SIGN = (temp >> 7) & 1;
                        this.F_ZERO = temp;
                        this.write(addr, temp);
                    }
                    break;
                }
                case 3: {
                    if (this.F_CARRY == 0) {
                        cycleCount += ((opaddr & 0xFF00) != (addr & 0xFF00) ? 2 : 1);
                        this.REG_PC = addr;
                    }
                    break;
                }
                case 4: {
                    if (this.F_CARRY == 1) {
                        cycleCount += ((opaddr & 0xFF00) != (addr & 0xFF00) ? 2 : 1);
                        this.REG_PC = addr;
                    }
                    break;
                }
                case 5: {
                    if (this.F_ZERO == 0) {
                        cycleCount += ((opaddr & 0xFF00) != (addr & 0xFF00) ? 2 : 1);
                        this.REG_PC = addr;
                    }
                    break;
                }
                case 6: {
                    temp = this.load(addr);
                    this.F_SIGN = (temp >> 7) & 1;
                    this.F_OVERFLOW = (temp >> 6) & 1;
                    temp &= this.REG_ACC;
                    this.F_ZERO = temp;
                    break;
                }
                case 7: {
                    if (this.F_SIGN == 1) {
                        cycleCount++;
                        this.REG_PC = addr;
                    }
                    break;
                }
                case 8: {
                    if (this.F_ZERO != 0) {
                        cycleCount += ((opaddr & 0xFF00) != (addr & 0xFF00) ? 2 : 1);
                        this.REG_PC = addr;
                    }
                    break;
                }
                case 9: {
                    if (this.F_SIGN == 0) {
                        cycleCount += ((opaddr & 0xFF00) != (addr & 0xFF00) ? 2 : 1);
                        this.REG_PC = addr;
                    }
                    break;
                }
                case 10: {
                    this.REG_PC += 2;
                    this.push((this.REG_PC >> 8) & 255);
                    this.push(this.REG_PC & 255);
                    this.F_BRK = 1;
                    this.push((this.F_CARRY) |
                        ((this.F_ZERO == 0 ? 1 : 0) << 1) |
                        (this.F_INTERRUPT << 2) |
                        (this.F_DECIMAL << 3) |
                        (this.F_BRK << 4) |
                        (this.F_NOTUSED << 5) |
                        (this.F_OVERFLOW << 6) |
                        (this.F_SIGN << 7));
                    this.F_INTERRUPT = 1;
                    this.REG_PC = this.load16bit(0xFFFE);
                    this.REG_PC--;
                    break;
                }
                case 11: {
                    if (this.F_OVERFLOW == 0) {
                        cycleCount += ((opaddr & 0xFF00) != (addr & 0xFF00) ? 2 : 1);
                        this.REG_PC = addr;
                    }
                    break;
                }
                case 12: {
                    if (this.F_OVERFLOW == 1) {
                        cycleCount += ((opaddr & 0xFF00) != (addr & 0xFF00) ? 2 : 1);
                        this.REG_PC = addr;
                    }
                    break;
                }
                case 13: {
                    this.F_CARRY = 0;
                    break;
                }
                case 14: {
                    this.F_DECIMAL = 0;
                    break;
                }
                case 15: {
                    this.F_INTERRUPT = 0;
                    break;
                }
                case 16: {
                    this.F_OVERFLOW = 0;
                    break;
                }
                case 17: {
                    temp = this.REG_ACC - this.load(addr);
                    this.F_CARRY = (temp >= 0 ? 1 : 0);
                    this.F_SIGN = (temp >> 7) & 1;
                    this.F_ZERO = temp & 0xFF;
                    cycleCount += cycleAdd;
                    break;
                }
                case 18: {
                    temp = this.REG_X - this.load(addr);
                    this.F_CARRY = (temp >= 0 ? 1 : 0);
                    this.F_SIGN = (temp >> 7) & 1;
                    this.F_ZERO = temp & 0xFF;
                    break;
                }
                case 19: {
                    temp = this.REG_Y - this.load(addr);
                    this.F_CARRY = (temp >= 0 ? 1 : 0);
                    this.F_SIGN = (temp >> 7) & 1;
                    this.F_ZERO = temp & 0xFF;
                    break;
                }
                case 20: {
                    temp = (this.load(addr) - 1) & 0xFF;
                    this.F_SIGN = (temp >> 7) & 1;
                    this.F_ZERO = temp;
                    this.write(addr, temp);
                    break;
                }
                case 21: {
                    this.REG_X = (this.REG_X - 1) & 0xFF;
                    this.F_SIGN = (this.REG_X >> 7) & 1;
                    this.F_ZERO = this.REG_X;
                    break;
                }
                case 22: {
                    this.REG_Y = (this.REG_Y - 1) & 0xFF;
                    this.F_SIGN = (this.REG_Y >> 7) & 1;
                    this.F_ZERO = this.REG_Y;
                    break;
                }
                case 23: {
                    this.REG_ACC = (this.load(addr) ^ this.REG_ACC) & 0xFF;
                    this.F_SIGN = (this.REG_ACC >> 7) & 1;
                    this.F_ZERO = this.REG_ACC;
                    cycleCount += cycleAdd;
                    break;
                }
                case 24: {
                    temp = (this.load(addr) + 1) & 0xFF;
                    this.F_SIGN = (temp >> 7) & 1;
                    this.F_ZERO = temp;
                    this.write(addr, temp & 0xFF);
                    break;
                }
                case 25: {
                    this.REG_X = (this.REG_X + 1) & 0xFF;
                    this.F_SIGN = (this.REG_X >> 7) & 1;
                    this.F_ZERO = this.REG_X;
                    break;
                }
                case 26: {
                    this.REG_Y++;
                    this.REG_Y &= 0xFF;
                    this.F_SIGN = (this.REG_Y >> 7) & 1;
                    this.F_ZERO = this.REG_Y;
                    break;
                }
                case 27: {
                    this.REG_PC = addr - 1;
                    break;
                }
                case 28: {
                    this.push((this.REG_PC >> 8) & 255);
                    this.push(this.REG_PC & 255);
                    this.REG_PC = addr - 1;
                    break;
                }
                case 29: {
                    this.REG_ACC = this.load(addr);
                    this.F_SIGN = (this.REG_ACC >> 7) & 1;
                    this.F_ZERO = this.REG_ACC;
                    cycleCount += cycleAdd;
                    break;
                }
                case 30: {
                    this.REG_X = this.load(addr);
                    this.F_SIGN = (this.REG_X >> 7) & 1;
                    this.F_ZERO = this.REG_X;
                    cycleCount += cycleAdd;
                    break;
                }
                case 31: {
                    this.REG_Y = this.load(addr);
                    this.F_SIGN = (this.REG_Y >> 7) & 1;
                    this.F_ZERO = this.REG_Y;
                    cycleCount += cycleAdd;
                    break;
                }
                case 32: {
                    if (addrMode == 4) {
                        temp = (this.REG_ACC & 0xFF);
                        this.F_CARRY = temp & 1;
                        temp >>= 1;
                        this.REG_ACC = temp;
                    }
                    else {
                        temp = this.load(addr) & 0xFF;
                        this.F_CARRY = temp & 1;
                        temp >>= 1;
                        this.write(addr, temp);
                    }
                    this.F_SIGN = 0;
                    this.F_ZERO = temp;
                    break;
                }
                case 33: {
                    break;
                }
                case 34: {
                    temp = (this.load(addr) | this.REG_ACC) & 255;
                    this.F_SIGN = (temp >> 7) & 1;
                    this.F_ZERO = temp;
                    this.REG_ACC = temp;
                    if (addrMode != 11)
                        cycleCount += cycleAdd;
                    break;
                }
                case 35: {
                    this.push(this.REG_ACC);
                    break;
                }
                case 36: {
                    this.F_BRK = 1;
                    this.push((this.F_CARRY) |
                        ((this.F_ZERO == 0 ? 1 : 0) << 1) |
                        (this.F_INTERRUPT << 2) |
                        (this.F_DECIMAL << 3) |
                        (this.F_BRK << 4) |
                        (this.F_NOTUSED << 5) |
                        (this.F_OVERFLOW << 6) |
                        (this.F_SIGN << 7));
                    break;
                }
                case 37: {
                    this.REG_ACC = this.pull();
                    this.F_SIGN = (this.REG_ACC >> 7) & 1;
                    this.F_ZERO = this.REG_ACC;
                    break;
                }
                case 38: {
                    temp = this.pull();
                    this.F_CARRY = (temp) & 1;
                    this.F_ZERO = (((temp >> 1) & 1) == 1) ? 0 : 1;
                    this.F_INTERRUPT = (temp >> 2) & 1;
                    this.F_DECIMAL = (temp >> 3) & 1;
                    this.F_BRK = (temp >> 4) & 1;
                    this.F_NOTUSED = (temp >> 5) & 1;
                    this.F_OVERFLOW = (temp >> 6) & 1;
                    this.F_SIGN = (temp >> 7) & 1;
                    this.F_NOTUSED = 1;
                    break;
                }
                case 39: {
                    if (addrMode == 4) {
                        temp = this.REG_ACC;
                        add = this.F_CARRY;
                        this.F_CARRY = (temp >> 7) & 1;
                        temp = ((temp << 1) & 0xFF) + add;
                        this.REG_ACC = temp;
                    }
                    else {
                        temp = this.load(addr);
                        add = this.F_CARRY;
                        this.F_CARRY = (temp >> 7) & 1;
                        temp = ((temp << 1) & 0xFF) + add;
                        this.write(addr, temp);
                    }
                    this.F_SIGN = (temp >> 7) & 1;
                    this.F_ZERO = temp;
                    break;
                }
                case 40: {
                    if (addrMode == 4) {
                        add = this.F_CARRY << 7;
                        this.F_CARRY = this.REG_ACC & 1;
                        temp = (this.REG_ACC >> 1) + add;
                        this.REG_ACC = temp;
                    }
                    else {
                        temp = this.load(addr);
                        add = this.F_CARRY << 7;
                        this.F_CARRY = temp & 1;
                        temp = (temp >> 1) + add;
                        this.write(addr, temp);
                    }
                    this.F_SIGN = (temp >> 7) & 1;
                    this.F_ZERO = temp;
                    break;
                }
                case 41: {
                    temp = this.pull();
                    this.F_CARRY = (temp) & 1;
                    this.F_ZERO = ((temp >> 1) & 1) == 0 ? 1 : 0;
                    this.F_INTERRUPT = (temp >> 2) & 1;
                    this.F_DECIMAL = (temp >> 3) & 1;
                    this.F_BRK = (temp >> 4) & 1;
                    this.F_NOTUSED = (temp >> 5) & 1;
                    this.F_OVERFLOW = (temp >> 6) & 1;
                    this.F_SIGN = (temp >> 7) & 1;
                    this.REG_PC = this.pull();
                    this.REG_PC += (this.pull() << 8);
                    if (this.REG_PC == 0xFFFF) {
                        return;
                    }
                    this.REG_PC--;
                    this.F_NOTUSED = 1;
                    break;
                }
                case 42: {
                    this.REG_PC = this.pull();
                    this.REG_PC += (this.pull() << 8);
                    if (this.REG_PC == 0xFFFF) {
                        return;
                    }
                    break;
                }
                case 43: {
                    temp = this.REG_ACC - this.load(addr) - (1 - this.F_CARRY);
                    this.F_SIGN = (temp >> 7) & 1;
                    this.F_ZERO = temp & 0xFF;
                    this.F_OVERFLOW = ((((this.REG_ACC ^ temp) & 0x80) != 0 && ((this.REG_ACC ^ this.load(addr)) & 0x80) != 0) ? 1 : 0);
                    this.F_CARRY = (temp < 0 ? 0 : 1);
                    this.REG_ACC = (temp & 0xFF);
                    if (addrMode != 11)
                        cycleCount += cycleAdd;
                    break;
                }
                case 44: {
                    this.F_CARRY = 1;
                    break;
                }
                case 45: {
                    this.F_DECIMAL = 1;
                    break;
                }
                case 46: {
                    this.F_INTERRUPT = 1;
                    break;
                }
                case 47: {
                    this.write(addr, this.REG_ACC);
                    break;
                }
                case 48: {
                    this.write(addr, this.REG_X);
                    break;
                }
                case 49: {
                    this.write(addr, this.REG_Y);
                    break;
                }
                case 50: {
                    this.REG_X = this.REG_ACC;
                    this.F_SIGN = (this.REG_ACC >> 7) & 1;
                    this.F_ZERO = this.REG_ACC;
                    break;
                }
                case 51: {
                    this.REG_Y = this.REG_ACC;
                    this.F_SIGN = (this.REG_ACC >> 7) & 1;
                    this.F_ZERO = this.REG_ACC;
                    break;
                }
                case 52: {
                    this.REG_X = (this.REG_SP - 0x0100);
                    this.F_SIGN = (this.REG_SP >> 7) & 1;
                    this.F_ZERO = this.REG_X;
                    break;
                }
                case 53: {
                    this.REG_ACC = this.REG_X;
                    this.F_SIGN = (this.REG_X >> 7) & 1;
                    this.F_ZERO = this.REG_X;
                    break;
                }
                case 54: {
                    this.REG_SP = (this.REG_X + 0x0100);
                    this.stackWrap();
                    break;
                }
                case 55: {
                    this.REG_ACC = this.REG_Y;
                    this.F_SIGN = (this.REG_Y >> 7) & 1;
                    this.F_ZERO = this.REG_Y;
                    break;
                }
                default: {
                    throw new Error('Game crashed, invalid opcode at address $' + opaddr.toString(16));
                }
            }
            return cycleCount;
        };
        CPU.prototype.load = function (addr) {
            if (addr < 0x2000) {
                return this.mem[addr & 0x7FF];
            }
            else {
                return this.mapper.load(addr);
            }
        };
        CPU.prototype.load16bit = function (addr) {
            if (addr < 0x1FFF) {
                return this.mem[addr & 0x7FF] | (this.mem[(addr + 1) & 0x7FF] << 8);
            }
            else {
                return this.mapper.load(addr) | (this.mapper.load(addr + 1) << 8);
            }
        };
        CPU.prototype.write = function (addr, val) {
            if (addr < 0x2000) {
                this.mem[addr & 0x7FF] = val;
            }
            else {
                this.mapper.write(addr, val);
            }
        };
        CPU.prototype.requestIrq = function (type) {
            if (this.irqRequested) {
                if (type == InstructionRequest.NORMAL) {
                    return;
                }
            }
            this.irqRequested = true;
            this.irqType = type;
        };
        CPU.prototype.push = function (value) {
            this.mapper.write(this.REG_SP, value);
            this.REG_SP--;
            this.REG_SP = 0x0100 | (this.REG_SP & 0xFF);
        };
        CPU.prototype.stackWrap = function () {
            this.REG_SP = 0x0100 | (this.REG_SP & 0xFF);
        };
        CPU.prototype.pull = function () {
            this.REG_SP++;
            this.REG_SP = 0x0100 | (this.REG_SP & 0xFF);
            return this.mapper.load(this.REG_SP);
        };
        CPU.prototype.pageCrossed = function (addr1, addr2) {
            return ((addr1 & 0xFF00) != (addr2 & 0xFF00));
        };
        CPU.prototype.haltCycles = function (cycles) {
            this.cyclesToHalt += cycles;
        };
        CPU.prototype.doNonMaskableInterrupt = function (status) {
            if ((this.mapper.load(0x2000) & 128) != 0) {
                this.REG_PC_NEW++;
                this.push((this.REG_PC_NEW >> 8) & 0xFF);
                this.push(this.REG_PC_NEW & 0xFF);
                this.push(status);
                this.REG_PC_NEW = this.mapper.load(0xFFFA) | (this.mapper.load(0xFFFB) << 8);
                this.REG_PC_NEW--;
            }
        };
        CPU.prototype.doResetInterrupt = function () {
            this.REG_PC_NEW = this.mapper.load(0xFFFC) | (this.mapper.load(0xFFFD) << 8);
            this.REG_PC_NEW--;
        };
        CPU.prototype.doIrq = function (status) {
            this.REG_PC_NEW++;
            this.push((this.REG_PC_NEW >> 8) & 0xFF);
            this.push(this.REG_PC_NEW & 0xFF);
            this.push(status);
            this.F_INTERRUPT_NEW = 1;
            this.F_BRK_NEW = 0;
            this.REG_PC_NEW = this.mapper.load(0xFFFE) | (this.mapper.load(0xFFFF) << 8);
            this.REG_PC_NEW--;
        };
        CPU.prototype.getStatus = function () {
            return (this.F_CARRY)
                | (this.F_ZERO << 1)
                | (this.F_INTERRUPT << 2)
                | (this.F_DECIMAL << 3)
                | (this.F_BRK << 4)
                | (this.F_NOTUSED << 5)
                | (this.F_OVERFLOW << 6)
                | (this.F_SIGN << 7);
        };
        CPU.prototype.setStatus = function (st) {
            this.F_CARRY = (st) & 1;
            this.F_ZERO = (st >> 1) & 1;
            this.F_INTERRUPT = (st >> 2) & 1;
            this.F_DECIMAL = (st >> 3) & 1;
            this.F_BRK = (st >> 4) & 1;
            this.F_NOTUSED = (st >> 5) & 1;
            this.F_OVERFLOW = (st >> 6) & 1;
            this.F_SIGN = (st >> 7) & 1;
        };
        CPU.serializable = [
            'mem', 'cyclesToHalt', 'irqRequested', 'irqType',
            'REG_ACC', 'REG_X', 'REG_Y', 'REG_SP', 'REG_PC', 'REG_PC_NEW',
            'REG_STATUS',
            'F_CARRY', 'F_DECIMAL', 'F_INTERRUPT', 'F_INTERRUPT_NEW', 'F_OVERFLOW',
            'F_SIGN', 'F_ZERO', 'F_NOTUSED', 'F_NOTUSED_NEW', 'F_BRK', 'F_BRK_NEW'
        ];
        return CPU;
    }());
    var Operation;
    (function (Operation) {
        var Instruction;
        (function (Instruction) {
            Instruction[Instruction["ADC"] = 0] = "ADC";
            Instruction[Instruction["AND"] = 1] = "AND";
            Instruction[Instruction["ASL"] = 2] = "ASL";
            Instruction[Instruction["BCC"] = 3] = "BCC";
            Instruction[Instruction["BCS"] = 4] = "BCS";
            Instruction[Instruction["BEQ"] = 5] = "BEQ";
            Instruction[Instruction["BIT"] = 6] = "BIT";
            Instruction[Instruction["BMI"] = 7] = "BMI";
            Instruction[Instruction["BNE"] = 8] = "BNE";
            Instruction[Instruction["BPL"] = 9] = "BPL";
            Instruction[Instruction["BRK"] = 10] = "BRK";
            Instruction[Instruction["BVC"] = 11] = "BVC";
            Instruction[Instruction["BVS"] = 12] = "BVS";
            Instruction[Instruction["CLC"] = 13] = "CLC";
            Instruction[Instruction["CLD"] = 14] = "CLD";
            Instruction[Instruction["CLI"] = 15] = "CLI";
            Instruction[Instruction["CLV"] = 16] = "CLV";
            Instruction[Instruction["CMP"] = 17] = "CMP";
            Instruction[Instruction["CPX"] = 18] = "CPX";
            Instruction[Instruction["CPY"] = 19] = "CPY";
            Instruction[Instruction["DEC"] = 20] = "DEC";
            Instruction[Instruction["DEX"] = 21] = "DEX";
            Instruction[Instruction["DEY"] = 22] = "DEY";
            Instruction[Instruction["EOR"] = 23] = "EOR";
            Instruction[Instruction["INC"] = 24] = "INC";
            Instruction[Instruction["INX"] = 25] = "INX";
            Instruction[Instruction["INY"] = 26] = "INY";
            Instruction[Instruction["JMP"] = 27] = "JMP";
            Instruction[Instruction["JSR"] = 28] = "JSR";
            Instruction[Instruction["LDA"] = 29] = "LDA";
            Instruction[Instruction["LDX"] = 30] = "LDX";
            Instruction[Instruction["LDY"] = 31] = "LDY";
            Instruction[Instruction["LSR"] = 32] = "LSR";
            Instruction[Instruction["NOP"] = 33] = "NOP";
            Instruction[Instruction["ORA"] = 34] = "ORA";
            Instruction[Instruction["PHA"] = 35] = "PHA";
            Instruction[Instruction["PHP"] = 36] = "PHP";
            Instruction[Instruction["PLA"] = 37] = "PLA";
            Instruction[Instruction["PLP"] = 38] = "PLP";
            Instruction[Instruction["ROL"] = 39] = "ROL";
            Instruction[Instruction["ROR"] = 40] = "ROR";
            Instruction[Instruction["RTI"] = 41] = "RTI";
            Instruction[Instruction["RTS"] = 42] = "RTS";
            Instruction[Instruction["SBC"] = 43] = "SBC";
            Instruction[Instruction["SEC"] = 44] = "SEC";
            Instruction[Instruction["SED"] = 45] = "SED";
            Instruction[Instruction["SEI"] = 46] = "SEI";
            Instruction[Instruction["STA"] = 47] = "STA";
            Instruction[Instruction["STX"] = 48] = "STX";
            Instruction[Instruction["STY"] = 49] = "STY";
            Instruction[Instruction["TAX"] = 50] = "TAX";
            Instruction[Instruction["TAY"] = 51] = "TAY";
            Instruction[Instruction["TSX"] = 52] = "TSX";
            Instruction[Instruction["TXA"] = 53] = "TXA";
            Instruction[Instruction["TXS"] = 54] = "TXS";
            Instruction[Instruction["TYA"] = 55] = "TYA";
            Instruction[Instruction["DUMMY"] = 56] = "DUMMY";
        })(Instruction || (Instruction = {}));
        var Address;
        (function (Address) {
            Address[Address["ZP"] = 0] = "ZP";
            Address[Address["REL"] = 1] = "REL";
            Address[Address["IMP"] = 2] = "IMP";
            Address[Address["ABS"] = 3] = "ABS";
            Address[Address["ACC"] = 4] = "ACC";
            Address[Address["IMM"] = 5] = "IMM";
            Address[Address["ZPX"] = 6] = "ZPX";
            Address[Address["ZPY"] = 7] = "ZPY";
            Address[Address["ABSX"] = 8] = "ABSX";
            Address[Address["ABSY"] = 9] = "ABSY";
            Address[Address["PREIDXIND"] = 10] = "PREIDXIND";
            Address[Address["POSTIDXIND"] = 11] = "POSTIDXIND";
            Address[Address["INDABS"] = 12] = "INDABS";
        })(Address || (Address = {}));
        var cycTable = [
            7, 6, 2, 8, 3, 3, 5, 5, 3, 2, 2, 2, 4, 4, 6, 6,
            2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
            6, 6, 2, 8, 3, 3, 5, 5, 4, 2, 2, 2, 4, 4, 6, 6,
            2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
            6, 6, 2, 8, 3, 3, 5, 5, 3, 2, 2, 2, 3, 4, 6, 6,
            2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
            6, 6, 2, 8, 3, 3, 5, 5, 4, 2, 2, 2, 5, 4, 6, 6,
            2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
            2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4,
            2, 6, 2, 6, 4, 4, 4, 4, 2, 5, 2, 5, 5, 5, 5, 5,
            2, 6, 2, 6, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4,
            2, 5, 2, 5, 4, 4, 4, 4, 2, 4, 2, 4, 4, 4, 4, 4,
            2, 6, 2, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6,
            2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7,
            2, 6, 3, 8, 3, 3, 5, 5, 2, 2, 2, 2, 4, 4, 6, 6,
            2, 5, 2, 8, 4, 4, 6, 6, 2, 4, 2, 7, 4, 4, 7, 7
        ];
        Operation.opdata = new Array(256);
        function setOp(inst, op, addr, size, cycles) {
            Operation.opdata[op] =
                ((inst & 0xFF)) |
                    ((addr & 0xFF) << 8) |
                    ((size & 0xFF) << 16) |
                    ((cycles & 0xFF) << 24);
        }
        for (var i = 0; i < 256; i++)
            Operation.opdata[i] = 0xFF;
        setOp(Instruction.ADC, 0x69, Address.IMM, 2, 2);
        setOp(Instruction.ADC, 0x65, Address.ZP, 2, 3);
        setOp(Instruction.ADC, 0x75, Address.ZPX, 2, 4);
        setOp(Instruction.ADC, 0x6D, Address.ABS, 3, 4);
        setOp(Instruction.ADC, 0x7D, Address.ABSX, 3, 4);
        setOp(Instruction.ADC, 0x79, Address.ABSY, 3, 4);
        setOp(Instruction.ADC, 0x61, Address.PREIDXIND, 2, 6);
        setOp(Instruction.ADC, 0x71, Address.POSTIDXIND, 2, 5);
        setOp(Instruction.AND, 0x29, Address.IMM, 2, 2);
        setOp(Instruction.AND, 0x25, Address.ZP, 2, 3);
        setOp(Instruction.AND, 0x35, Address.ZPX, 2, 4);
        setOp(Instruction.AND, 0x2D, Address.ABS, 3, 4);
        setOp(Instruction.AND, 0x3D, Address.ABSX, 3, 4);
        setOp(Instruction.AND, 0x39, Address.ABSY, 3, 4);
        setOp(Instruction.AND, 0x21, Address.PREIDXIND, 2, 6);
        setOp(Instruction.AND, 0x31, Address.POSTIDXIND, 2, 5);
        setOp(Instruction.ASL, 0x0A, Address.ACC, 1, 2);
        setOp(Instruction.ASL, 0x06, Address.ZP, 2, 5);
        setOp(Instruction.ASL, 0x16, Address.ZPX, 2, 6);
        setOp(Instruction.ASL, 0x0E, Address.ABS, 3, 6);
        setOp(Instruction.ASL, 0x1E, Address.ABSX, 3, 7);
        setOp(Instruction.BCC, 0x90, Address.REL, 2, 2);
        setOp(Instruction.BCS, 0xB0, Address.REL, 2, 2);
        setOp(Instruction.BEQ, 0xF0, Address.REL, 2, 2);
        setOp(Instruction.BIT, 0x24, Address.ZP, 2, 3);
        setOp(Instruction.BIT, 0x2C, Address.ABS, 3, 4);
        setOp(Instruction.BMI, 0x30, Address.REL, 2, 2);
        setOp(Instruction.BNE, 0xD0, Address.REL, 2, 2);
        setOp(Instruction.BPL, 0x10, Address.REL, 2, 2);
        setOp(Instruction.BRK, 0x00, Address.IMP, 1, 7);
        setOp(Instruction.BVC, 0x50, Address.REL, 2, 2);
        setOp(Instruction.BVS, 0x70, Address.REL, 2, 2);
        setOp(Instruction.CLC, 0x18, Address.IMP, 1, 2);
        setOp(Instruction.CLD, 0xD8, Address.IMP, 1, 2);
        setOp(Instruction.CLI, 0x58, Address.IMP, 1, 2);
        setOp(Instruction.CLV, 0xB8, Address.IMP, 1, 2);
        setOp(Instruction.CMP, 0xC9, Address.IMM, 2, 2);
        setOp(Instruction.CMP, 0xC5, Address.ZP, 2, 3);
        setOp(Instruction.CMP, 0xD5, Address.ZPX, 2, 4);
        setOp(Instruction.CMP, 0xCD, Address.ABS, 3, 4);
        setOp(Instruction.CMP, 0xDD, Address.ABSX, 3, 4);
        setOp(Instruction.CMP, 0xD9, Address.ABSY, 3, 4);
        setOp(Instruction.CMP, 0xC1, Address.PREIDXIND, 2, 6);
        setOp(Instruction.CMP, 0xD1, Address.POSTIDXIND, 2, 5);
        setOp(Instruction.CPX, 0xE0, Address.IMM, 2, 2);
        setOp(Instruction.CPX, 0xE4, Address.ZP, 2, 3);
        setOp(Instruction.CPX, 0xEC, Address.ABS, 3, 4);
        setOp(Instruction.CPY, 0xC0, Address.IMM, 2, 2);
        setOp(Instruction.CPY, 0xC4, Address.ZP, 2, 3);
        setOp(Instruction.CPY, 0xCC, Address.ABS, 3, 4);
        setOp(Instruction.DEC, 0xC6, Address.ZP, 2, 5);
        setOp(Instruction.DEC, 0xD6, Address.ZPX, 2, 6);
        setOp(Instruction.DEC, 0xCE, Address.ABS, 3, 6);
        setOp(Instruction.DEC, 0xDE, Address.ABSX, 3, 7);
        setOp(Instruction.DEX, 0xCA, Address.IMP, 1, 2);
        setOp(Instruction.DEY, 0x88, Address.IMP, 1, 2);
        setOp(Instruction.EOR, 0x49, Address.IMM, 2, 2);
        setOp(Instruction.EOR, 0x45, Address.ZP, 2, 3);
        setOp(Instruction.EOR, 0x55, Address.ZPX, 2, 4);
        setOp(Instruction.EOR, 0x4D, Address.ABS, 3, 4);
        setOp(Instruction.EOR, 0x5D, Address.ABSX, 3, 4);
        setOp(Instruction.EOR, 0x59, Address.ABSY, 3, 4);
        setOp(Instruction.EOR, 0x41, Address.PREIDXIND, 2, 6);
        setOp(Instruction.EOR, 0x51, Address.POSTIDXIND, 2, 5);
        setOp(Instruction.INC, 0xE6, Address.ZP, 2, 5);
        setOp(Instruction.INC, 0xF6, Address.ZPX, 2, 6);
        setOp(Instruction.INC, 0xEE, Address.ABS, 3, 6);
        setOp(Instruction.INC, 0xFE, Address.ABSX, 3, 7);
        setOp(Instruction.INX, 0xE8, Address.IMP, 1, 2);
        setOp(Instruction.INY, 0xC8, Address.IMP, 1, 2);
        setOp(Instruction.JMP, 0x4C, Address.ABS, 3, 3);
        setOp(Instruction.JMP, 0x6C, Address.INDABS, 3, 5);
        setOp(Instruction.JSR, 0x20, Address.ABS, 3, 6);
        setOp(Instruction.LDA, 0xA9, Address.IMM, 2, 2);
        setOp(Instruction.LDA, 0xA5, Address.ZP, 2, 3);
        setOp(Instruction.LDA, 0xB5, Address.ZPX, 2, 4);
        setOp(Instruction.LDA, 0xAD, Address.ABS, 3, 4);
        setOp(Instruction.LDA, 0xBD, Address.ABSX, 3, 4);
        setOp(Instruction.LDA, 0xB9, Address.ABSY, 3, 4);
        setOp(Instruction.LDA, 0xA1, Address.PREIDXIND, 2, 6);
        setOp(Instruction.LDA, 0xB1, Address.POSTIDXIND, 2, 5);
        setOp(Instruction.LDX, 0xA2, Address.IMM, 2, 2);
        setOp(Instruction.LDX, 0xA6, Address.ZP, 2, 3);
        setOp(Instruction.LDX, 0xB6, Address.ZPY, 2, 4);
        setOp(Instruction.LDX, 0xAE, Address.ABS, 3, 4);
        setOp(Instruction.LDX, 0xBE, Address.ABSY, 3, 4);
        setOp(Instruction.LDY, 0xA0, Address.IMM, 2, 2);
        setOp(Instruction.LDY, 0xA4, Address.ZP, 2, 3);
        setOp(Instruction.LDY, 0xB4, Address.ZPX, 2, 4);
        setOp(Instruction.LDY, 0xAC, Address.ABS, 3, 4);
        setOp(Instruction.LDY, 0xBC, Address.ABSX, 3, 4);
        setOp(Instruction.LSR, 0x4A, Address.ACC, 1, 2);
        setOp(Instruction.LSR, 0x46, Address.ZP, 2, 5);
        setOp(Instruction.LSR, 0x56, Address.ZPX, 2, 6);
        setOp(Instruction.LSR, 0x4E, Address.ABS, 3, 6);
        setOp(Instruction.LSR, 0x5E, Address.ABSX, 3, 7);
        setOp(Instruction.NOP, 0xEA, Address.IMP, 1, 2);
        setOp(Instruction.ORA, 0x09, Address.IMM, 2, 2);
        setOp(Instruction.ORA, 0x05, Address.ZP, 2, 3);
        setOp(Instruction.ORA, 0x15, Address.ZPX, 2, 4);
        setOp(Instruction.ORA, 0x0D, Address.ABS, 3, 4);
        setOp(Instruction.ORA, 0x1D, Address.ABSX, 3, 4);
        setOp(Instruction.ORA, 0x19, Address.ABSY, 3, 4);
        setOp(Instruction.ORA, 0x01, Address.PREIDXIND, 2, 6);
        setOp(Instruction.ORA, 0x11, Address.POSTIDXIND, 2, 5);
        setOp(Instruction.PHA, 0x48, Address.IMP, 1, 3);
        setOp(Instruction.PHP, 0x08, Address.IMP, 1, 3);
        setOp(Instruction.PLA, 0x68, Address.IMP, 1, 4);
        setOp(Instruction.PLP, 0x28, Address.IMP, 1, 4);
        setOp(Instruction.ROL, 0x2A, Address.ACC, 1, 2);
        setOp(Instruction.ROL, 0x26, Address.ZP, 2, 5);
        setOp(Instruction.ROL, 0x36, Address.ZPX, 2, 6);
        setOp(Instruction.ROL, 0x2E, Address.ABS, 3, 6);
        setOp(Instruction.ROL, 0x3E, Address.ABSX, 3, 7);
        setOp(Instruction.ROR, 0x6A, Address.ACC, 1, 2);
        setOp(Instruction.ROR, 0x66, Address.ZP, 2, 5);
        setOp(Instruction.ROR, 0x76, Address.ZPX, 2, 6);
        setOp(Instruction.ROR, 0x6E, Address.ABS, 3, 6);
        setOp(Instruction.ROR, 0x7E, Address.ABSX, 3, 7);
        setOp(Instruction.RTI, 0x40, Address.IMP, 1, 6);
        setOp(Instruction.RTS, 0x60, Address.IMP, 1, 6);
        setOp(Instruction.SBC, 0xE9, Address.IMM, 2, 2);
        setOp(Instruction.SBC, 0xE5, Address.ZP, 2, 3);
        setOp(Instruction.SBC, 0xF5, Address.ZPX, 2, 4);
        setOp(Instruction.SBC, 0xED, Address.ABS, 3, 4);
        setOp(Instruction.SBC, 0xFD, Address.ABSX, 3, 4);
        setOp(Instruction.SBC, 0xF9, Address.ABSY, 3, 4);
        setOp(Instruction.SBC, 0xE1, Address.PREIDXIND, 2, 6);
        setOp(Instruction.SBC, 0xF1, Address.POSTIDXIND, 2, 5);
        setOp(Instruction.SEC, 0x38, Address.IMP, 1, 2);
        setOp(Instruction.SED, 0xF8, Address.IMP, 1, 2);
        setOp(Instruction.SEI, 0x78, Address.IMP, 1, 2);
        setOp(Instruction.STA, 0x85, Address.ZP, 2, 3);
        setOp(Instruction.STA, 0x95, Address.ZPX, 2, 4);
        setOp(Instruction.STA, 0x8D, Address.ABS, 3, 4);
        setOp(Instruction.STA, 0x9D, Address.ABSX, 3, 5);
        setOp(Instruction.STA, 0x99, Address.ABSY, 3, 5);
        setOp(Instruction.STA, 0x81, Address.PREIDXIND, 2, 6);
        setOp(Instruction.STA, 0x91, Address.POSTIDXIND, 2, 6);
        setOp(Instruction.STX, 0x86, Address.ZP, 2, 3);
        setOp(Instruction.STX, 0x96, Address.ZPY, 2, 4);
        setOp(Instruction.STX, 0x8E, Address.ABS, 3, 4);
        setOp(Instruction.STY, 0x84, Address.ZP, 2, 3);
        setOp(Instruction.STY, 0x94, Address.ZPX, 2, 4);
        setOp(Instruction.STY, 0x8C, Address.ABS, 3, 4);
        setOp(Instruction.TAX, 0xAA, Address.IMP, 1, 2);
        setOp(Instruction.TAY, 0xA8, Address.IMP, 1, 2);
        setOp(Instruction.TSX, 0xBA, Address.IMP, 1, 2);
        setOp(Instruction.TXA, 0x8A, Address.IMP, 1, 2);
        setOp(Instruction.TXS, 0x9A, Address.IMP, 1, 2);
        setOp(Instruction.TYA, 0x98, Address.IMP, 1, 2);
    })(Operation || (Operation = {}));
    var Instruction;
    (function (Instruction) {
        Instruction[Instruction["ADC"] = 0] = "ADC";
        Instruction[Instruction["AND"] = 1] = "AND";
        Instruction[Instruction["ASL"] = 2] = "ASL";
        Instruction[Instruction["BCC"] = 3] = "BCC";
        Instruction[Instruction["BCS"] = 4] = "BCS";
        Instruction[Instruction["BEQ"] = 5] = "BEQ";
        Instruction[Instruction["BIT"] = 6] = "BIT";
        Instruction[Instruction["BMI"] = 7] = "BMI";
        Instruction[Instruction["BNE"] = 8] = "BNE";
        Instruction[Instruction["BPL"] = 9] = "BPL";
        Instruction[Instruction["BRK"] = 10] = "BRK";
        Instruction[Instruction["BVC"] = 11] = "BVC";
        Instruction[Instruction["BVS"] = 12] = "BVS";
        Instruction[Instruction["CLC"] = 13] = "CLC";
        Instruction[Instruction["CLD"] = 14] = "CLD";
        Instruction[Instruction["CLI"] = 15] = "CLI";
        Instruction[Instruction["CLV"] = 16] = "CLV";
        Instruction[Instruction["CMP"] = 17] = "CMP";
        Instruction[Instruction["CPX"] = 18] = "CPX";
        Instruction[Instruction["CPY"] = 19] = "CPY";
        Instruction[Instruction["DEC"] = 20] = "DEC";
        Instruction[Instruction["DEX"] = 21] = "DEX";
        Instruction[Instruction["DEY"] = 22] = "DEY";
        Instruction[Instruction["EOR"] = 23] = "EOR";
        Instruction[Instruction["INC"] = 24] = "INC";
        Instruction[Instruction["INX"] = 25] = "INX";
        Instruction[Instruction["INY"] = 26] = "INY";
        Instruction[Instruction["JMP"] = 27] = "JMP";
        Instruction[Instruction["JSR"] = 28] = "JSR";
        Instruction[Instruction["LDA"] = 29] = "LDA";
        Instruction[Instruction["LDX"] = 30] = "LDX";
        Instruction[Instruction["LDY"] = 31] = "LDY";
        Instruction[Instruction["LSR"] = 32] = "LSR";
        Instruction[Instruction["NOP"] = 33] = "NOP";
        Instruction[Instruction["ORA"] = 34] = "ORA";
        Instruction[Instruction["PHA"] = 35] = "PHA";
        Instruction[Instruction["PHP"] = 36] = "PHP";
        Instruction[Instruction["PLA"] = 37] = "PLA";
        Instruction[Instruction["PLP"] = 38] = "PLP";
        Instruction[Instruction["ROL"] = 39] = "ROL";
        Instruction[Instruction["ROR"] = 40] = "ROR";
        Instruction[Instruction["RTI"] = 41] = "RTI";
        Instruction[Instruction["RTS"] = 42] = "RTS";
        Instruction[Instruction["SBC"] = 43] = "SBC";
        Instruction[Instruction["SEC"] = 44] = "SEC";
        Instruction[Instruction["SED"] = 45] = "SED";
        Instruction[Instruction["SEI"] = 46] = "SEI";
        Instruction[Instruction["STA"] = 47] = "STA";
        Instruction[Instruction["STX"] = 48] = "STX";
        Instruction[Instruction["STY"] = 49] = "STY";
        Instruction[Instruction["TAX"] = 50] = "TAX";
        Instruction[Instruction["TAY"] = 51] = "TAY";
        Instruction[Instruction["TSX"] = 52] = "TSX";
        Instruction[Instruction["TXA"] = 53] = "TXA";
        Instruction[Instruction["TXS"] = 54] = "TXS";
        Instruction[Instruction["TYA"] = 55] = "TYA";
        Instruction[Instruction["DUMMY"] = 56] = "DUMMY";
    })(Instruction || (Instruction = {}));
    var Address;
    (function (Address) {
        Address[Address["ZP"] = 0] = "ZP";
        Address[Address["REL"] = 1] = "REL";
        Address[Address["IMP"] = 2] = "IMP";
        Address[Address["ABS"] = 3] = "ABS";
        Address[Address["ACC"] = 4] = "ACC";
        Address[Address["IMM"] = 5] = "IMM";
        Address[Address["ZPX"] = 6] = "ZPX";
        Address[Address["ZPY"] = 7] = "ZPY";
        Address[Address["ABSX"] = 8] = "ABSX";
        Address[Address["ABSY"] = 9] = "ABSY";
        Address[Address["PREIDXIND"] = 10] = "PREIDXIND";
        Address[Address["POSTIDXIND"] = 11] = "POSTIDXIND";
        Address[Address["INDABS"] = 12] = "INDABS";
    })(Address || (Address = {}));
    var Emulator = /** @class */ (function () {
        function Emulator() {
            this.system = null;
            this.rom = null;
            this.onsample = null;
            this.onerror = null;
        }
        Emulator.prototype.load = function (data) {
            if (this.system) {
                this.system = null;
            }
            var rom = new Rom(data);
            if (System.romSupported(rom)) {
                this.rom = rom;
                this.system = new System(this.rom, this.onsample, this.onerror);
            }
            else {
                throw new Error('This ROM uses a unsupported mapper: ' + rom.mapperType);
            }
        };
        Emulator.prototype.reset = function () {
            if (this.rom) {
                this.system = new System(this.rom, this.onsample, this.onerror);
            }
        };
        Emulator.prototype.buttonDown = function (player, button) {
            if (this.system) {
                this.system.buttonDown(player, button);
            }
        };
        Emulator.prototype.buttonUp = function (player, button) {
            if (this.system) {
                this.system.buttonUp(player, button);
            }
        };
        Emulator.prototype.frame = function () {
            if (this.system) {
                if (this.system.frame()) {
                    return true;
                }
                else {
                    this.system = null;
                    return false;
                }
            }
            else {
                return false;
            }
        };
        Emulator.prototype.pull = function () {
            return this.system ? this.system.pull() : null;
        };
        return Emulator;
    }());
    exports.Emulator = Emulator;
    function copy(src, srcPos, dest, destPos, length) {
        for (var i = 0; i < length; i += 1) {
            dest[destPos + i] = src[srcPos + i];
        }
    }
    var Mapper = /** @class */ (function () {
        function Mapper(cpu, ppu, apu, controller, rom) {
            this.cpu = cpu;
            this.ppu = ppu;
            this.apu = apu;
            this.controller = controller;
            this.rom = rom;
            this.joy1StrobeState = 0;
            this.joy2StrobeState = 0;
            this.joypadLastWrite = 0;
            this.mousePressed = false;
            this.mouseX = null;
            this.mouseY = null;
        }
        Object.defineProperty(Mapper.prototype, "serializable", {
            get: function () {
                return Mapper.serializable;
            },
            enumerable: true,
            configurable: true
        });
        Mapper.romSupported = function (rom) {
            return mappers[rom.mapperType] !== undefined;
        };
        Mapper.create = function (cpu, ppu, apu, controller, rom) {
            var mapper = new mappers[rom.mapperType](cpu, ppu, apu, controller, rom);
            mapper.loadROM();
            return mapper;
        };
        Mapper.prototype.write = function (address, value) {
            if (address < 0x2000) {
                this.cpu.mem[address & 0x7FF] = value;
            }
            else if (address > 0x4017) {
                this.cpu.mem[address] = value;
                if (address >= 0x6000 && address < 0x8000) {
                }
            }
            else if (address > 0x2007 && address < 0x4000) {
                this.regWrite(0x2000 + (address & 0x7), value);
            }
            else {
                this.regWrite(address, value);
            }
        };
        Mapper.prototype.writelow = function (address, value) {
            if (address < 0x2000) {
                this.cpu.mem[address & 0x7FF] = value;
            }
            else if (address > 0x4017) {
                this.cpu.mem[address] = value;
            }
            else if (address > 0x2007 && address < 0x4000) {
                this.regWrite(0x2000 + (address & 0x7), value);
            }
            else {
                this.regWrite(address, value);
            }
        };
        Mapper.prototype.load = function (address) {
            address &= 0xFFFF;
            if (address > 0x4017) {
                return this.cpu.mem[address];
            }
            else if (address >= 0x2000) {
                return this.regLoad(address);
            }
            else {
                return this.cpu.mem[address & 0x7FF];
            }
        };
        Mapper.prototype.regLoad = function (address) {
            switch (address >> 12) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                case 3:
                    switch (address & 0x7) {
                        case 0x0:
                            return this.cpu.mem[0x2000];
                        case 0x1:
                            return this.cpu.mem[0x2001];
                        case 0x2:
                            return this.ppu.readStatusRegister();
                        case 0x3:
                            return 0;
                        case 0x4:
                            return this.ppu.sramLoad();
                        case 0x5:
                            return 0;
                        case 0x6:
                            return 0;
                        case 0x7:
                            return this.ppu.vramLoad();
                    }
                    break;
                case 4:
                    switch (address - 0x4015) {
                        case 0:
                            return this.apu.readReg(address);
                        case 1:
                            return this.joy1Read();
                        case 2:
                            if (this.mousePressed) {
                                var sx = Math.max(0, this.mouseX - 4);
                                var ex = Math.min(256, this.mouseX + 4);
                                var sy = Math.max(0, this.mouseY - 4);
                                var ey = Math.min(240, this.mouseY + 4);
                                var w = 0;
                                for (var y = sy; y < ey; y++) {
                                    for (var x = sx; x < ex; x++) {
                                        if (this.ppu.buffer[(y << 8) + x] == 0xFFFFFF) {
                                            w |= 0x1 << 3;
                                            console.debug("Clicked on white!");
                                            break;
                                        }
                                    }
                                }
                                w |= (this.mousePressed ? (0x1 << 4) : 0);
                                return (this.joy2Read() | w) & 0xFFFF;
                            }
                            else {
                                return this.joy2Read();
                            }
                    }
                    break;
            }
            return 0;
        };
        Mapper.prototype.regWrite = function (address, value) {
            switch (address) {
                case 0x2000:
                    this.cpu.mem[address] = value;
                    this.ppu.updateControlReg1(value);
                    break;
                case 0x2001:
                    this.cpu.mem[address] = value;
                    this.ppu.updateControlReg2(value);
                    break;
                case 0x2003:
                    this.ppu.writeSRAMAddress(value);
                    break;
                case 0x2004:
                    this.ppu.sramWrite(value);
                    break;
                case 0x2005:
                    this.ppu.scrollWrite(value);
                    break;
                case 0x2006:
                    this.ppu.writeVRAMAddress(value);
                    break;
                case 0x2007:
                    this.ppu.vramWrite(value);
                    break;
                case 0x4014:
                    this.ppu.sramDMA(value);
                    break;
                case 0x4015:
                    this.apu.writeReg(address, value);
                    break;
                case 0x4016:
                    if ((value & 1) === 0 && (this.joypadLastWrite & 1) === 1) {
                        this.joy1StrobeState = 0;
                        this.joy2StrobeState = 0;
                    }
                    this.joypadLastWrite = value;
                    break;
                case 0x4017:
                    this.apu.writeReg(address, value);
                    break;
                default:
                    if (address >= 0x4000 && address <= 0x4017) {
                        this.apu.writeReg(address, value);
                    }
            }
        };
        Mapper.prototype.joy1Read = function () {
            var ret;
            switch (this.joy1StrobeState) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    ret = this.controller.state1[this.joy1StrobeState];
                    break;
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                    ret = 0;
                    break;
                case 19:
                    ret = 1;
                    break;
                default:
                    ret = 0;
            }
            this.joy1StrobeState++;
            if (this.joy1StrobeState == 24) {
                this.joy1StrobeState = 0;
            }
            return ret;
        };
        Mapper.prototype.joy2Read = function () {
            var ret;
            switch (this.joy2StrobeState) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    ret = this.controller.state2[this.joy2StrobeState];
                    break;
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                    ret = 0;
                    break;
                case 19:
                    ret = 1;
                    break;
                default:
                    ret = 0;
            }
            this.joy2StrobeState++;
            if (this.joy2StrobeState == 24) {
                this.joy2StrobeState = 0;
            }
            return ret;
        };
        Mapper.prototype.loadROM = function () {
            this.loadPRGROM();
            this.loadCHRROM();
            this.loadBatteryRam();
            this.cpu.requestIrq(InstructionRequest.RESET);
        };
        Mapper.prototype.loadPRGROM = function () {
            if (this.rom.romCount > 1) {
                this.loadRomBank(0, 0x8000);
                this.loadRomBank(1, 0xC000);
            }
            else {
                this.loadRomBank(0, 0x8000);
                this.loadRomBank(0, 0xC000);
            }
        };
        Mapper.prototype.loadCHRROM = function () {
            if (this.rom.vromCount > 0) {
                if (this.rom.vromCount == 1) {
                    this.loadVromBank(0, 0x0000);
                    this.loadVromBank(0, 0x1000);
                }
                else {
                    this.loadVromBank(0, 0x0000);
                    this.loadVromBank(1, 0x1000);
                }
            }
            else {
            }
        };
        Mapper.prototype.loadBatteryRam = function () {
        };
        Mapper.prototype.loadRomBank = function (bank, address) {
            bank %= this.rom.romCount;
            copy(this.rom.rom[bank], 0, this.cpu.mem, address, 16384);
        };
        Mapper.prototype.loadVromBank = function (bank, address) {
            if (this.rom.vromCount === 0) {
                return;
            }
            this.ppu.triggerRendering();
            copy(this.rom.vrom[bank % this.rom.vromCount], 0, this.ppu.vramMem, address, 4096);
            var vromTile = this.rom.vromTile[bank % this.rom.vromCount];
            copy(vromTile, 0, this.ppu.ptTile, address >> 4, 256);
        };
        Mapper.prototype.load32kRomBank = function (bank, address) {
            this.loadRomBank((bank * 2) % this.rom.romCount, address);
            this.loadRomBank((bank * 2 + 1) % this.rom.romCount, address + 16384);
        };
        Mapper.prototype.load8kVromBank = function (bank4kStart, address) {
            if (this.rom.vromCount === 0) {
                return;
            }
            this.ppu.triggerRendering();
            this.loadVromBank((bank4kStart) % this.rom.vromCount, address);
            this.loadVromBank((bank4kStart + 1) % this.rom.vromCount, address + 4096);
        };
        Mapper.prototype.load1kVromBank = function (bank1k, address) {
            if (this.rom.vromCount === 0) {
                return;
            }
            this.ppu.triggerRendering();
            var bank4k = Math.floor(bank1k / 4) % this.rom.vromCount;
            var bankoffset = (bank1k % 4) * 1024;
            copy(this.rom.vrom[bank4k], bankoffset, this.ppu.vramMem, address, 1024);
            var vromTile = this.rom.vromTile[bank4k];
            var baseIndex = address >> 4;
            for (var i = 0; i < 64; i++) {
                this.ppu.ptTile[baseIndex + i] = vromTile[((bank1k % 4) << 6) + i];
            }
        };
        Mapper.prototype.load2kVromBank = function (bank2k, address) {
            if (this.rom.vromCount === 0) {
                return;
            }
            this.ppu.triggerRendering();
            var bank4k = Math.floor(bank2k / 2) % this.rom.vromCount;
            var bankoffset = (bank2k % 2) * 2048;
            copy(this.rom.vrom[bank4k], bankoffset, this.ppu.vramMem, address, 2048);
            var vromTile = this.rom.vromTile[bank4k];
            var baseIndex = address >> 4;
            for (var i = 0; i < 128; i++) {
                this.ppu.ptTile[baseIndex + i] = vromTile[((bank2k % 2) << 7) + i];
            }
        };
        Mapper.prototype.load8kRomBank = function (bank8k, address) {
            var bank16k = Math.floor(bank8k / 2) % this.rom.romCount;
            var offset = (bank8k % 2) * 8192;
            copy(this.rom.rom[bank16k], offset, this.cpu.mem, address, 8192);
        };
        Mapper.prototype.clockIrqCounter = function () {
        };
        Mapper.prototype.latchAccess = function (address) {
        };
        Mapper.serializable = [
            'joy1StrobeState',
            'joy2StrobeState',
            'joypadLastWrite'
        ];
        return Mapper;
    }());
    var mappers = [];
    mappers[0] = Mapper;
    var Mapper1 = /** @class */ (function (_super) {
        __extends(Mapper1, _super);
        function Mapper1(cpu, ppu, apu, controller, rom) {
            var _this = _super.call(this, cpu, ppu, apu, controller, rom) || this;
            _this.regBuffer = 0;
            _this.regBufferCounter = 0;
            _this.mirroring = 0;
            _this.oneScreenMirroring = 0;
            _this.prgSwitchingArea = 1;
            _this.prgSwitchingSize = 1;
            _this.vromSwitchingSize = 0;
            _this.romSelectionReg0 = 0;
            _this.romSelectionReg1 = 0;
            _this.romBankSelect = 0;
            _this.regBuffer = 0;
            _this.regBufferCounter = 0;
            _this.mirroring = 0;
            _this.oneScreenMirroring = 0;
            _this.prgSwitchingArea = 1;
            _this.prgSwitchingSize = 1;
            _this.vromSwitchingSize = 0;
            _this.romSelectionReg0 = 0;
            _this.romSelectionReg1 = 0;
            _this.romBankSelect = 0;
            return _this;
        }
        Object.defineProperty(Mapper1.prototype, "serializable", {
            get: function () {
                return Mapper.serializable;
            },
            enumerable: true,
            configurable: true
        });
        Mapper1.prototype.write = function (address, value) {
            if (address < 0x8000) {
                _super.prototype.write.call(this, address, value);
                return;
            }
            if ((value & 128) !== 0) {
                this.regBufferCounter = 0;
                this.regBuffer = 0;
                if (this.getRegNumber(address) === 0) {
                    this.prgSwitchingArea = 1;
                    this.prgSwitchingSize = 1;
                }
            }
            else {
                this.regBuffer = (this.regBuffer & (0xFF - (1 << this.regBufferCounter))) | ((value & 1) << this.regBufferCounter);
                this.regBufferCounter++;
                if (this.regBufferCounter == 5) {
                    this.setReg(this.getRegNumber(address), this.regBuffer);
                    this.regBuffer = 0;
                    this.regBufferCounter = 0;
                }
            }
        };
        Mapper1.prototype.setReg = function (reg, value) {
            var tmp;
            switch (reg) {
                case 0:
                    tmp = value & 3;
                    if (tmp !== this.mirroring) {
                        this.mirroring = tmp;
                        if ((this.mirroring & 2) === 0) {
                            this.ppu.setMirroring(MirroringType.singleScreen);
                        }
                        else if ((this.mirroring & 1) !== 0) {
                            this.ppu.setMirroring(MirroringType.horizontal);
                        }
                        else {
                            this.ppu.setMirroring(MirroringType.vertical);
                        }
                    }
                    this.prgSwitchingArea = (value >> 2) & 1;
                    this.prgSwitchingSize = (value >> 3) & 1;
                    this.vromSwitchingSize = (value >> 4) & 1;
                    break;
                case 1:
                    this.romSelectionReg0 = (value >> 4) & 1;
                    if (this.rom.vromCount > 0) {
                        if (this.vromSwitchingSize === 0) {
                            if (this.romSelectionReg0 === 0) {
                                this.load8kVromBank((value & 0xF), 0x0000);
                            }
                            else {
                                this.load8kVromBank(Math.floor(this.rom.vromCount / 2) + (value & 0xF), 0x0000);
                            }
                        }
                        else {
                            if (this.romSelectionReg0 === 0) {
                                this.loadVromBank((value & 0xF), 0x0000);
                            }
                            else {
                                this.loadVromBank(Math.floor(this.rom.vromCount / 2) + (value & 0xF), 0x0000);
                            }
                        }
                    }
                    break;
                case 2:
                    this.romSelectionReg1 = (value >> 4) & 1;
                    if (this.rom.vromCount > 0) {
                        if (this.vromSwitchingSize === 1) {
                            if (this.romSelectionReg1 === 0) {
                                this.loadVromBank((value & 0xF), 0x1000);
                            }
                            else {
                                this.loadVromBank(Math.floor(this.rom.vromCount / 2) + (value & 0xF), 0x1000);
                            }
                        }
                    }
                    break;
                default:
                    tmp = value & 0xF;
                    var bank;
                    var baseBank = 0;
                    if (this.rom.romCount >= 32) {
                        if (this.vromSwitchingSize === 0) {
                            if (this.romSelectionReg0 === 1) {
                                baseBank = 16;
                            }
                        }
                        else {
                            baseBank = (this.romSelectionReg0
                                | (this.romSelectionReg1 << 1)) << 3;
                        }
                    }
                    else if (this.rom.romCount >= 16) {
                        if (this.romSelectionReg0 === 1) {
                            baseBank = 8;
                        }
                    }
                    if (this.prgSwitchingSize === 0) {
                        bank = baseBank + (value & 0xF);
                        this.load32kRomBank(bank, 0x8000);
                    }
                    else {
                        bank = baseBank * 2 + (value & 0xF);
                        if (this.prgSwitchingArea === 0) {
                            this.loadRomBank(bank, 0xC000);
                        }
                        else {
                            this.loadRomBank(bank, 0x8000);
                        }
                    }
            }
        };
        Mapper1.prototype.getRegNumber = function (address) {
            if (address >= 0x8000 && address <= 0x9FFF) {
                return 0;
            }
            else if (address >= 0xA000 && address <= 0xBFFF) {
                return 1;
            }
            else if (address >= 0xC000 && address <= 0xDFFF) {
                return 2;
            }
            else {
                return 3;
            }
        };
        Mapper1.prototype.loadROM = function () {
            this.loadRomBank(0, 0x8000);
            this.loadRomBank(this.rom.romCount - 1, 0xC000);
            this.loadCHRROM();
            this.loadBatteryRam();
            this.cpu.requestIrq(InstructionRequest.RESET);
        };
        Mapper1.prototype.switchLowHighPrgRom = function (oldSetting) {
        };
        Mapper1.prototype.switch16to32 = function () {
        };
        Mapper1.prototype.switch32to16 = function () {
        };
        Mapper1.serializable = Mapper.serializable.concat('regBuffer', 'regBufferCounter', 'mirroring', 'oneScreenMirroring', 'prgSwitchingArea', 'prgSwitchingSize', 'vromSwitchingSize', 'romSelectionReg0', 'romSelectionReg1', 'romBankSelect');
        return Mapper1;
    }(Mapper));
    mappers[1] = Mapper1;
    var Mapper2 = /** @class */ (function (_super) {
        __extends(Mapper2, _super);
        function Mapper2() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Mapper2.prototype.write = function (address, value) {
            if (address < 0x8000) {
                _super.prototype.write.call(this, address, value);
            }
            else {
                this.loadRomBank(value, 0x8000);
            }
        };
        Mapper2.prototype.loadROM = function () {
            this.loadRomBank(0, 0x8000);
            this.loadRomBank(this.rom.romCount - 1, 0xC000);
            this.loadCHRROM();
            this.cpu.requestIrq(InstructionRequest.RESET);
        };
        return Mapper2;
    }(Mapper));
    mappers[2] = Mapper2;
    var Mapper3 = /** @class */ (function (_super) {
        __extends(Mapper3, _super);
        function Mapper3() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Mapper3.prototype.write = function (address, value) {
            if (address < 0x8000) {
                _super.prototype.write.call(this, address, value);
            }
            else {
                var bank = (value % (this.rom.romCount / 2)) * 2;
                this.loadVromBank(bank, 0x0000);
                this.loadVromBank(bank + 1, 0x1000);
                this.load8kVromBank(value * 2, 0x0000);
            }
        };
        return Mapper3;
    }(Mapper));
    mappers[3] = Mapper3;
    var Mapper4 = /** @class */ (function (_super) {
        __extends(Mapper4, _super);
        function Mapper4() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.CMD_SEL_2_1K_VROM_0000 = 0;
            _this.CMD_SEL_2_1K_VROM_0800 = 1;
            _this.CMD_SEL_1K_VROM_1000 = 2;
            _this.CMD_SEL_1K_VROM_1400 = 3;
            _this.CMD_SEL_1K_VROM_1800 = 4;
            _this.CMD_SEL_1K_VROM_1C00 = 5;
            _this.CMD_SEL_ROM_PAGE1 = 6;
            _this.CMD_SEL_ROM_PAGE2 = 7;
            _this.command = 0;
            _this.prgAddressSelect = 0;
            _this.chrAddressSelect = 0;
            _this.pageNumber = 0;
            _this.irqCounter = 0;
            _this.irqLatchValue = 0;
            _this.irqEnable = 0;
            _this.prgAddressChanged = false;
            return _this;
        }
        Object.defineProperty(Mapper4.prototype, "serializable", {
            get: function () {
                return Mapper.serializable;
            },
            enumerable: true,
            configurable: true
        });
        Mapper4.prototype.write = function (address, value) {
            if (address < 0x8000) {
                _super.prototype.write.call(this, address, value);
                return;
            }
            switch (address) {
                case 0x8000:
                    this.command = value & 7;
                    var tmp = (value >> 6) & 1;
                    if (tmp != this.prgAddressSelect) {
                        this.prgAddressChanged = true;
                    }
                    this.prgAddressSelect = tmp;
                    this.chrAddressSelect = (value >> 7) & 1;
                    break;
                case 0x8001:
                    this.executeCommand(this.command, value);
                    break;
                case 0xA000:
                    if ((value & 1) !== 0) {
                        this.ppu.setMirroring(MirroringType.horizontal);
                    }
                    else {
                        this.ppu.setMirroring(MirroringType.vertical);
                    }
                    break;
                case 0xA001:
                    break;
                case 0xC000:
                    this.irqCounter = value;
                    break;
                case 0xC001:
                    this.irqLatchValue = value;
                    break;
                case 0xE000:
                    this.irqEnable = 0;
                    break;
                case 0xE001:
                    this.irqEnable = 1;
                    break;
                default:
            }
        };
        Mapper4.prototype.executeCommand = function (cmd, arg) {
            switch (cmd) {
                case this.CMD_SEL_2_1K_VROM_0000:
                    if (this.chrAddressSelect === 0) {
                        this.load1kVromBank(arg, 0x0000);
                        this.load1kVromBank(arg + 1, 0x0400);
                    }
                    else {
                        this.load1kVromBank(arg, 0x1000);
                        this.load1kVromBank(arg + 1, 0x1400);
                    }
                    break;
                case this.CMD_SEL_2_1K_VROM_0800:
                    if (this.chrAddressSelect === 0) {
                        this.load1kVromBank(arg, 0x0800);
                        this.load1kVromBank(arg + 1, 0x0C00);
                    }
                    else {
                        this.load1kVromBank(arg, 0x1800);
                        this.load1kVromBank(arg + 1, 0x1C00);
                    }
                    break;
                case this.CMD_SEL_1K_VROM_1000:
                    if (this.chrAddressSelect === 0) {
                        this.load1kVromBank(arg, 0x1000);
                    }
                    else {
                        this.load1kVromBank(arg, 0x0000);
                    }
                    break;
                case this.CMD_SEL_1K_VROM_1400:
                    if (this.chrAddressSelect === 0) {
                        this.load1kVromBank(arg, 0x1400);
                    }
                    else {
                        this.load1kVromBank(arg, 0x0400);
                    }
                    break;
                case this.CMD_SEL_1K_VROM_1800:
                    if (this.chrAddressSelect === 0) {
                        this.load1kVromBank(arg, 0x1800);
                    }
                    else {
                        this.load1kVromBank(arg, 0x0800);
                    }
                    break;
                case this.CMD_SEL_1K_VROM_1C00:
                    if (this.chrAddressSelect === 0) {
                        this.load1kVromBank(arg, 0x1C00);
                    }
                    else {
                        this.load1kVromBank(arg, 0x0C00);
                    }
                    break;
                case this.CMD_SEL_ROM_PAGE1:
                    if (this.prgAddressChanged) {
                        if (this.prgAddressSelect === 0) {
                            this.load8kRomBank(((this.rom.romCount - 1) * 2), 0xC000);
                        }
                        else {
                            this.load8kRomBank(((this.rom.romCount - 1) * 2), 0x8000);
                        }
                        this.prgAddressChanged = false;
                    }
                    if (this.prgAddressSelect === 0) {
                        this.load8kRomBank(arg, 0x8000);
                    }
                    else {
                        this.load8kRomBank(arg, 0xC000);
                    }
                    break;
                case this.CMD_SEL_ROM_PAGE2:
                    this.load8kRomBank(arg, 0xA000);
                    if (this.prgAddressChanged) {
                        if (this.prgAddressSelect === 0) {
                            this.load8kRomBank(((this.rom.romCount - 1) * 2), 0xC000);
                        }
                        else {
                            this.load8kRomBank(((this.rom.romCount - 1) * 2), 0x8000);
                        }
                        this.prgAddressChanged = false;
                    }
            }
        };
        Mapper4.prototype.loadROM = function () {
            this.load8kRomBank(((this.rom.romCount - 1) * 2), 0xC000);
            this.load8kRomBank(((this.rom.romCount - 1) * 2) + 1, 0xE000);
            this.load8kRomBank(0, 0x8000);
            this.load8kRomBank(1, 0xA000);
            this.loadCHRROM();
            this.loadBatteryRam();
            this.cpu.requestIrq(InstructionRequest.RESET);
        };
        ;
        Mapper4.prototype.clockIrqCounter = function () {
            if (this.irqEnable == 1) {
                this.irqCounter--;
                if (this.irqCounter < 0) {
                    this.cpu.requestIrq(InstructionRequest.NORMAL);
                    this.irqCounter = this.irqLatchValue;
                }
            }
        };
        Mapper4.serializable = Mapper.serializable.concat('command', 'prgAddressSelect', 'chrAddressSelect', 'pageNumber', 'irqCounter', 'irqLatchValue', 'irqEnable', 'prgAddressChanged');
        return Mapper4;
    }(Mapper));
    mappers[4] = Mapper4;
    // Mapper 23: VRC2b / VRC4f (A0,A1) and VRC4e (A2,A3).
    // Register and IRQ reference: https://www.nesdev.org/wiki/VRC2_and_VRC4
    // Legacy iNES headers combine both address wirings, as other VRC4 cores do.
    var Mapper23 = (function (_super) {
        __extends(Mapper23, _super);
        function Mapper23() {
            var self = _super !== null && _super.apply(this, arguments) || this;
            self.prg0 = 0;
            self.prg1 = 1;
            self.prgSwap = false;
            self.chrBanks = [0, 1, 2, 3, 4, 5, 6, 7];
            self.irqLatch = 0;
            self.irqCounter = 0;
            self.irqControl = 0;
            self.irqPrescaler = 341;
            self.irqPending = false;
            return self;
        }
        Mapper23.prototype.syncPRG = function () {
            var fixed = this.rom.romCount * 2 - 2;
            this.load8kRomBank(this.prgSwap ? fixed : this.prg0, 0x8000);
            this.load8kRomBank(this.prg1, 0xA000);
            this.load8kRomBank(this.prgSwap ? this.prg0 : fixed, 0xC000);
            this.load8kRomBank(fixed + 1, 0xE000);
        };
        Mapper23.prototype.loadROM = function () {
            this.syncPRG();
            this.loadCHRROM();
            this.loadBatteryRam();
            this.cpu.requestIrq(InstructionRequest.RESET);
        };
        Mapper23.prototype.write = function (address, value) {
            if (address < 0x8000) {
                _super.prototype.write.call(this, address, value);
                return;
            }
            var reg = (address & 3) | ((address >> 2) & 3);
            var page = address & 0xF000;
            if (page === 0x8000 || page === 0xA000) {
                if (page === 0x8000) this.prg0 = value & 31;
                else this.prg1 = value & 31;
                this.syncPRG();
            }
            else if (page === 0x9000) {
                if (reg === 0) {
                    var modes = [MirroringType.vertical, MirroringType.horizontal,
                        MirroringType.singleScreen, MirroringType.singleScreen2];
                    this.ppu.setMirroring(modes[value & 3]);
                }
                else if (reg === 2) {
                    this.prgSwap = (value & 2) !== 0;
                    this.syncPRG();
                }
            }
            else if (page >= 0xB000 && page <= 0xE000) {
                var bank = ((page - 0xB000) >> 11) + (reg >> 1);
                if (reg & 1) this.chrBanks[bank] = (this.chrBanks[bank] & 15) | ((value & 31) << 4);
                else this.chrBanks[bank] = (this.chrBanks[bank] & 0x1F0) | (value & 15);
                this.load1kVromBank(this.chrBanks[bank], bank * 1024);
            }
            else if (page === 0xF000) {
                if (reg === 0) this.irqLatch = (this.irqLatch & 0xF0) | (value & 15);
                else if (reg === 1) this.irqLatch = (this.irqLatch & 15) | ((value & 15) << 4);
                else if (reg === 2) {
                    this.irqPending = false;
                    this.irqControl = value & 7;
                    this.irqPrescaler = 341;
                    if (value & 2) this.irqCounter = this.irqLatch;
                }
                else {
                    this.irqPending = false;
                    this.irqControl = (this.irqControl & 5) | ((this.irqControl & 1) << 1);
                }
            }
        };
        Mapper23.prototype.clockCpuCycles = function (cycles) {
            if (!(this.irqControl & 2)) return;
            for (var i = 0; i < cycles; i++) {
                if (!(this.irqControl & 4)) {
                    this.irqPrescaler -= 3;
                    if (this.irqPrescaler > 0) continue;
                    this.irqPrescaler += 341;
                }
                if (this.irqCounter === 255) {
                    this.irqCounter = this.irqLatch;
                    this.irqPending = true;
                }
                else this.irqCounter++;
            }
        };
        return Mapper23;
    }(Mapper));
    mappers[23] = Mapper23;
    var Mapper66 = /** @class */ (function (_super) {
        __extends(Mapper66, _super);
        function Mapper66() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Mapper66.prototype.write = function (address, value) {
            if (address < 0x8000) {
                _super.prototype.write.call(this, address, value);
            }
            else {
                this.load32kRomBank((value >> 4) & 3, 0x8000);
                this.load8kVromBank((value & 3) * 2, 0x0000);
            }
        };
        return Mapper66;
    }(Mapper));
    mappers[66] = Mapper66;
    var StatusFlag;
    (function (StatusFlag) {
        StatusFlag[StatusFlag["VRAMWRITE"] = 4] = "VRAMWRITE";
        StatusFlag[StatusFlag["SLSPRITECOUNT"] = 5] = "SLSPRITECOUNT";
        StatusFlag[StatusFlag["SPRITE0HIT"] = 6] = "SPRITE0HIT";
        StatusFlag[StatusFlag["VBLANK"] = 7] = "VBLANK";
    })(StatusFlag || (StatusFlag = {}));
    var PPU = /** @class */ (function () {
        function PPU(cpu, writeFrame) {
            this.cpu = cpu;
            this.writeFrame = writeFrame;
            this.showSpr0Hit = false;
            this.clipToTvSize = true;
            this.vramMem = new Array(0x8000);
            this.spriteMem = new Array(0x100);
            for (var i = 0; i < this.vramMem.length; i += 1) {
                this.vramMem[i] = 0;
            }
            for (var i = 0; i < this.spriteMem.length; i += 1) {
                this.spriteMem[i] = 0;
            }
            this.vramAddress = null;
            this.vramTmpAddress = null;
            this.vramBufferedReadValue = 0;
            this.firstWrite = true;
            this.sramAddress = 0;
            this.currentMirroring = -1;
            this.requestEndFrame = false;
            this.nmiOk = false;
            this.dummyCycleToggle = false;
            this.validTileData = false;
            this.nmiCounter = 0;
            this.scanlineAlreadyRendered = null;
            this.f_nmiOnVblank = 0;
            this.f_spriteSize = 0;
            this.f_bgPatternTable = 0;
            this.f_spPatternTable = 0;
            this.f_addrInc = 0;
            this.f_nTblAddress = 0;
            this.f_color = 0;
            this.f_spVisibility = 0;
            this.f_bgVisibility = 0;
            this.f_spClipping = 0;
            this.f_bgClipping = 0;
            this.f_dispType = 0;
            this.cntFV = 0;
            this.cntV = 0;
            this.cntH = 0;
            this.cntVT = 0;
            this.cntHT = 0;
            this.regFV = 0;
            this.regV = 0;
            this.regH = 0;
            this.regVT = 0;
            this.regHT = 0;
            this.regFH = 0;
            this.regS = 0;
            this.curNt = null;
            this.attrib = new Array(32);
            this.buffer = new Array(256 * 240);
            this.bgbuffer = new Array(256 * 240);
            this.pixrendered = new Array(256 * 240);
            this.scantile = new Array(32);
            this.scanline = 0;
            this.lastRenderedScanline = -1;
            this.curX = 0;
            this.sprX = new Array(64);
            this.sprY = new Array(64);
            this.sprTile = new Array(64);
            this.sprCol = new Array(64);
            this.vertFlip = new Array(64);
            this.horiFlip = new Array(64);
            this.bgPriority = new Array(64);
            this.spr0HitX = 0;
            this.spr0HitY = 0;
            this.hitSpr0 = false;
            this.sprPalette = new Array(16);
            this.imgPalette = new Array(16);
            this.ptTile = new Array(512);
            for (var i = 0; i < 512; i += 1) {
                this.ptTile[i] = new Tile();
            }
            this.ntable1 = new Array(4);
            this.currentMirroring = -1;
            this.nameTable = new Array(4);
            for (var i = 0; i < 4; i += 1) {
                this.nameTable[i] = new NameTable(32, 32, "Nt" + i);
            }
            this.vramMirrorTable = new Array(0x8000);
            for (var i = 0; i < 0x8000; i += 1) {
                this.vramMirrorTable[i] = i;
            }
            this.palTable = new PaletteTable();
            this.palTable.loadNTSCPalette();
            this.updateControlReg1(0);
            this.updateControlReg2(0);
        }
        Object.defineProperty(PPU.prototype, "serializable", {
            get: function () {
                return PPU.serializable;
            },
            enumerable: true,
            configurable: true
        });
        PPU.prototype.setMirroring = function (mirroring) {
            if (mirroring == this.currentMirroring) {
                return;
            }
            this.currentMirroring = mirroring;
            this.triggerRendering();
            if (this.vramMirrorTable === null) {
                this.vramMirrorTable = new Array(0x8000);
            }
            for (var i = 0; i < 0x8000; i += 1) {
                this.vramMirrorTable[i] = i;
            }
            this.defineMirrorRegion(0x3f20, 0x3f00, 0x20);
            this.defineMirrorRegion(0x3f40, 0x3f00, 0x20);
            this.defineMirrorRegion(0x3f80, 0x3f00, 0x20);
            this.defineMirrorRegion(0x3fc0, 0x3f00, 0x20);
            this.defineMirrorRegion(0x3000, 0x2000, 0xf00);
            this.defineMirrorRegion(0x4000, 0x0000, 0x4000);
            if (mirroring == MirroringType.horizontal) {
                this.ntable1[0] = 0;
                this.ntable1[1] = 0;
                this.ntable1[2] = 1;
                this.ntable1[3] = 1;
                this.defineMirrorRegion(0x2400, 0x2000, 0x400);
                this.defineMirrorRegion(0x2c00, 0x2800, 0x400);
            }
            else if (mirroring == MirroringType.vertical) {
                this.ntable1[0] = 0;
                this.ntable1[1] = 1;
                this.ntable1[2] = 0;
                this.ntable1[3] = 1;
                this.defineMirrorRegion(0x2800, 0x2000, 0x400);
                this.defineMirrorRegion(0x2c00, 0x2400, 0x400);
            }
            else if (mirroring == MirroringType.singleScreen) {
                this.ntable1[0] = 0;
                this.ntable1[1] = 0;
                this.ntable1[2] = 0;
                this.ntable1[3] = 0;
                this.defineMirrorRegion(0x2400, 0x2000, 0x400);
                this.defineMirrorRegion(0x2800, 0x2000, 0x400);
                this.defineMirrorRegion(0x2c00, 0x2000, 0x400);
            }
            else if (mirroring == MirroringType.singleScreen2) {
                this.ntable1[0] = 1;
                this.ntable1[1] = 1;
                this.ntable1[2] = 1;
                this.ntable1[3] = 1;
                this.defineMirrorRegion(0x2400, 0x2400, 0x400);
                this.defineMirrorRegion(0x2800, 0x2400, 0x400);
                this.defineMirrorRegion(0x2c00, 0x2400, 0x400);
            }
            else {
                this.ntable1[0] = 0;
                this.ntable1[1] = 1;
                this.ntable1[2] = 2;
                this.ntable1[3] = 3;
            }
        };
        PPU.prototype.defineMirrorRegion = function (fromStart, toStart, size) {
            for (var i = 0; i < size; i += 1) {
                this.vramMirrorTable[fromStart + i] = toStart + i;
            }
        };
        PPU.prototype.startVBlank = function () {
            this.cpu.requestIrq(InstructionRequest.NMI);
            if (this.lastRenderedScanline < 239) {
                this.renderFramePartially(this.lastRenderedScanline + 1, 240 - this.lastRenderedScanline);
            }
            this.endFrame();
            this.lastRenderedScanline = -1;
        };
        PPU.prototype.endScanline = function () {
            switch (this.scanline) {
                case 19:
                    if (this.dummyCycleToggle) {
                        this.curX = 1;
                        this.dummyCycleToggle = !this.dummyCycleToggle;
                    }
                    break;
                case 20:
                    this.setStatusFlag(StatusFlag.VBLANK, false);
                    this.setStatusFlag(StatusFlag.SPRITE0HIT, false);
                    this.hitSpr0 = false;
                    this.spr0HitX = -1;
                    this.spr0HitY = -1;
                    if (this.f_bgVisibility == 1 || this.f_spVisibility == 1) {
                        this.cntFV = this.regFV;
                        this.cntV = this.regV;
                        this.cntH = this.regH;
                        this.cntVT = this.regVT;
                        this.cntHT = this.regHT;
                        if (this.f_bgVisibility == 1) {
                            this.renderBgScanline(false, 0);
                        }
                    }
                    if (this.f_bgVisibility == 1 && this.f_spVisibility == 1) {
                        this.checkSprite0(0);
                    }
                    if (this.f_bgVisibility == 1 || this.f_spVisibility == 1) {
                        this.cpu.mapper.clockIrqCounter();
                    }
                    break;
                case 261:
                    this.setStatusFlag(StatusFlag.VBLANK, true);
                    this.requestEndFrame = true;
                    this.nmiCounter = 9;
                    this.scanline = -1;
                    break;
                default:
                    if (this.scanline >= 21 && this.scanline <= 260) {
                        if (this.f_bgVisibility == 1) {
                            if (!this.scanlineAlreadyRendered) {
                                this.cntHT = this.regHT;
                                this.cntH = this.regH;
                                this.renderBgScanline(true, this.scanline + 1 - 21);
                            }
                            this.scanlineAlreadyRendered = false;
                            if (!this.hitSpr0 && this.f_spVisibility == 1) {
                                if (this.sprX[0] >= -7 &&
                                    this.sprX[0] < 256 &&
                                    this.sprY[0] + 1 <= (this.scanline - 20) &&
                                    (this.sprY[0] + 1 + (this.f_spriteSize === 0 ? 8 : 16)) >= (this.scanline - 20)) {
                                    if (this.checkSprite0(this.scanline - 20)) {
                                        this.hitSpr0 = true;
                                    }
                                }
                            }
                        }
                        if (this.f_bgVisibility == 1 || this.f_spVisibility == 1) {
                            this.cpu.mapper.clockIrqCounter();
                        }
                    }
            }
            this.scanline += 1;
            this.regsToAddress();
            this.cntsToAddress();
        };
        PPU.prototype.startFrame = function () {
            var bgColor = 0;
            if (this.f_dispType === 0) {
                bgColor = this.imgPalette[0];
            }
            else {
                switch (this.f_color) {
                    case 0:
                        bgColor = 0x00000;
                        break;
                    case 1:
                        bgColor = 0x00FF00;
                        break;
                    case 2:
                        bgColor = 0xFF0000;
                        break;
                    case 3:
                        bgColor = 0x000000;
                        break;
                    case 4:
                        bgColor = 0x0000FF;
                        break;
                    default:
                        bgColor = 0x0;
                }
            }
            var buffer = this.buffer;
            var i;
            for (i = 0; i < 256 * 240; i += 1) {
                buffer[i] = bgColor;
            }
            var pixrendered = this.pixrendered;
            for (i = 0; i < pixrendered.length; i += 1) {
                pixrendered[i] = 65;
            }
        };
        PPU.prototype.endFrame = function () {
            var i;
            var x;
            var y;
            var buffer = this.buffer;
            if (this.showSpr0Hit) {
                if (this.sprX[0] >= 0 && this.sprX[0] < 256 &&
                    this.sprY[0] >= 0 && this.sprY[0] < 240) {
                    for (i = 0; i < 256; i += 1) {
                        buffer[(this.sprY[0] << 8) + i] = 0xFF5555;
                    }
                    for (i = 0; i < 240; i += 1) {
                        buffer[(i << 8) + this.sprX[0]] = 0xFF5555;
                    }
                }
                if (this.spr0HitX >= 0 && this.spr0HitX < 256 &&
                    this.spr0HitY >= 0 && this.spr0HitY < 240) {
                    for (i = 0; i < 256; i += 1) {
                        buffer[(this.spr0HitY << 8) + i] = 0x55FF55;
                    }
                    for (i = 0; i < 256; i += 1) {
                        buffer[(i << 8) + this.spr0HitX] = 0x55FF55;
                    }
                }
            }
            if (this.clipToTvSize || this.f_bgClipping === 0 || this.f_spClipping === 0) {
                for (y = 0; y < 240; y += 1) {
                    for (x = 0; x < 8; x += 1) {
                        buffer[(y << 8) + x] = 0;
                    }
                }
            }
            if (this.clipToTvSize) {
                for (y = 0; y < 240; y += 1) {
                    for (x = 0; x < 8; x += 1) {
                        buffer[(y << 8) + 255 - x] = 0;
                    }
                }
            }
            if (this.clipToTvSize) {
                for (y = 0; y < 240; y += 1) {
                    for (x = 0; x < 8; x += 1) {
                        buffer[(y << 8) + x] = 0;
                        buffer[((239 - y) << 8) + x] = 0;
                    }
                }
            }
            this.writeFrame(buffer);
        };
        PPU.prototype.updateControlReg1 = function (value) {
            this.triggerRendering();
            this.f_nmiOnVblank = (value >> 7) & 1;
            this.f_spriteSize = (value >> 5) & 1;
            this.f_bgPatternTable = (value >> 4) & 1;
            this.f_spPatternTable = (value >> 3) & 1;
            this.f_addrInc = (value >> 2) & 1;
            this.f_nTblAddress = value & 3;
            this.regV = (value >> 1) & 1;
            this.regH = value & 1;
            this.regS = (value >> 4) & 1;
        };
        PPU.prototype.updateControlReg2 = function (value) {
            this.triggerRendering();
            this.f_color = (value >> 5) & 7;
            this.f_spVisibility = (value >> 4) & 1;
            this.f_bgVisibility = (value >> 3) & 1;
            this.f_spClipping = (value >> 2) & 1;
            this.f_bgClipping = (value >> 1) & 1;
            this.f_dispType = value & 1;
            if (this.f_dispType === 0) {
                this.palTable.setEmphasis(this.f_color);
            }
            this.updatePalettes();
        };
        PPU.prototype.setStatusFlag = function (flag, value) {
            var n = 1 << flag;
            this.cpu.mem[0x2002] =
                ((this.cpu.mem[0x2002] & (255 - n)) | (value ? n : 0));
        };
        PPU.prototype.readStatusRegister = function () {
            var tmp = this.cpu.mem[0x2002];
            this.firstWrite = true;
            this.setStatusFlag(StatusFlag.VBLANK, false);
            return tmp;
        };
        PPU.prototype.writeSRAMAddress = function (address) {
            this.sramAddress = address;
        };
        PPU.prototype.sramLoad = function () {
            return this.spriteMem[this.sramAddress];
        };
        PPU.prototype.sramWrite = function (value) {
            this.spriteMem[this.sramAddress] = value;
            this.spriteRamWriteUpdate(this.sramAddress, value);
            this.sramAddress++;
            this.sramAddress %= 0x100;
        };
        PPU.prototype.scrollWrite = function (value) {
            this.triggerRendering();
            if (this.firstWrite) {
                this.regHT = (value >> 3) & 31;
                this.regFH = value & 7;
            }
            else {
                this.regFV = value & 7;
                this.regVT = (value >> 3) & 31;
            }
            this.firstWrite = !this.firstWrite;
        };
        PPU.prototype.writeVRAMAddress = function (address) {
            if (this.firstWrite) {
                this.regFV = (address >> 4) & 3;
                this.regV = (address >> 3) & 1;
                this.regH = (address >> 2) & 1;
                this.regVT = (this.regVT & 7) | ((address & 3) << 3);
            }
            else {
                this.triggerRendering();
                this.regVT = (this.regVT & 24) | ((address >> 5) & 7);
                this.regHT = address & 31;
                this.cntFV = this.regFV;
                this.cntV = this.regV;
                this.cntH = this.regH;
                this.cntVT = this.regVT;
                this.cntHT = this.regHT;
                this.checkSprite0(this.scanline - 20);
            }
            this.firstWrite = !this.firstWrite;
            this.cntsToAddress();
            if (this.vramAddress < 0x2000) {
                this.cpu.mapper.latchAccess(this.vramAddress);
            }
        };
        PPU.prototype.vramLoad = function () {
            var tmp;
            this.cntsToAddress();
            this.regsToAddress();
            if (this.vramAddress <= 0x3EFF) {
                tmp = this.vramBufferedReadValue;
                if (this.vramAddress < 0x2000) {
                    this.vramBufferedReadValue = this.vramMem[this.vramAddress];
                }
                else {
                    this.vramBufferedReadValue = this.mirroredLoad(this.vramAddress);
                }
                if (this.vramAddress < 0x2000) {
                    this.cpu.mapper.latchAccess(this.vramAddress);
                }
                this.vramAddress += (this.f_addrInc == 1 ? 32 : 1);
                this.cntsFromAddress();
                this.regsFromAddress();
                return tmp;
            }
            tmp = this.mirroredLoad(this.vramAddress);
            this.vramAddress += (this.f_addrInc == 1 ? 32 : 1);
            this.cntsFromAddress();
            this.regsFromAddress();
            return tmp;
        };
        PPU.prototype.vramWrite = function (value) {
            this.triggerRendering();
            this.cntsToAddress();
            this.regsToAddress();
            if (this.vramAddress >= 0x2000) {
                this.mirroredWrite(this.vramAddress, value);
            }
            else {
                this.writeMem(this.vramAddress, value);
                this.cpu.mapper.latchAccess(this.vramAddress);
            }
            this.vramAddress += (this.f_addrInc == 1 ? 32 : 1);
            this.regsFromAddress();
            this.cntsFromAddress();
        };
        PPU.prototype.sramDMA = function (value) {
            var baseAddress = value * 0x100;
            var data;
            for (var i = this.sramAddress; i < 256; i++) {
                data = this.cpu.mem[baseAddress + i];
                this.spriteMem[i] = data;
                this.spriteRamWriteUpdate(i, data);
            }
            this.cpu.haltCycles(513);
        };
        PPU.prototype.regsFromAddress = function () {
            var address = (this.vramTmpAddress >> 8) & 0xFF;
            this.regFV = (address >> 4) & 7;
            this.regV = (address >> 3) & 1;
            this.regH = (address >> 2) & 1;
            this.regVT = (this.regVT & 7) | ((address & 3) << 3);
            address = this.vramTmpAddress & 0xFF;
            this.regVT = (this.regVT & 24) | ((address >> 5) & 7);
            this.regHT = address & 31;
        };
        PPU.prototype.cntsFromAddress = function () {
            var address = (this.vramAddress >> 8) & 0xFF;
            this.cntFV = (address >> 4) & 3;
            this.cntV = (address >> 3) & 1;
            this.cntH = (address >> 2) & 1;
            this.cntVT = (this.cntVT & 7) | ((address & 3) << 3);
            address = this.vramAddress & 0xFF;
            this.cntVT = (this.cntVT & 24) | ((address >> 5) & 7);
            this.cntHT = address & 31;
        };
        PPU.prototype.regsToAddress = function () {
            var b1 = (this.regFV & 7) << 4;
            b1 |= (this.regV & 1) << 3;
            b1 |= (this.regH & 1) << 2;
            b1 |= (this.regVT >> 3) & 3;
            var b2 = (this.regVT & 7) << 5;
            b2 |= this.regHT & 31;
            this.vramTmpAddress = ((b1 << 8) | b2) & 0x7FFF;
        };
        PPU.prototype.cntsToAddress = function () {
            var b1 = (this.cntFV & 7) << 4;
            b1 |= (this.cntV & 1) << 3;
            b1 |= (this.cntH & 1) << 2;
            b1 |= (this.cntVT >> 3) & 3;
            var b2 = (this.cntVT & 7) << 5;
            b2 |= this.cntHT & 31;
            this.vramAddress = ((b1 << 8) | b2) & 0x7FFF;
        };
        PPU.prototype.incTileCounter = function (count) {
            for (var i = count; i !== 0; i--) {
                this.cntHT++;
                if (this.cntHT == 32) {
                    this.cntHT = 0;
                    this.cntVT++;
                    if (this.cntVT >= 30) {
                        this.cntH++;
                        if (this.cntH == 2) {
                            this.cntH = 0;
                            this.cntV++;
                            if (this.cntV == 2) {
                                this.cntV = 0;
                                this.cntFV++;
                                this.cntFV &= 0x7;
                            }
                        }
                    }
                }
            }
        };
        PPU.prototype.mirroredLoad = function (address) {
            return this.vramMem[this.vramMirrorTable[address]];
        };
        PPU.prototype.mirroredWrite = function (address, value) {
            if (address >= 0x3f00 && address < 0x3f20) {
                if (address == 0x3F00 || address == 0x3F10) {
                    this.writeMem(0x3F00, value);
                    this.writeMem(0x3F10, value);
                }
                else if (address == 0x3F04 || address == 0x3F14) {
                    this.writeMem(0x3F04, value);
                    this.writeMem(0x3F14, value);
                }
                else if (address == 0x3F08 || address == 0x3F18) {
                    this.writeMem(0x3F08, value);
                    this.writeMem(0x3F18, value);
                }
                else if (address == 0x3F0C || address == 0x3F1C) {
                    this.writeMem(0x3F0C, value);
                    this.writeMem(0x3F1C, value);
                }
                else {
                    this.writeMem(address, value);
                }
            }
            else {
                if (address < this.vramMirrorTable.length) {
                    this.writeMem(this.vramMirrorTable[address], value);
                }
                else {
                    alert("Invalid VRAM address: " + address.toString(16));
                }
            }
        };
        PPU.prototype.triggerRendering = function () {
            if (this.scanline >= 21 && this.scanline <= 260) {
                this.renderFramePartially(this.lastRenderedScanline + 1, this.scanline - 21 - this.lastRenderedScanline);
                this.lastRenderedScanline = this.scanline - 21;
            }
        };
        PPU.prototype.renderFramePartially = function (startScan, scanCount) {
            if (this.f_spVisibility == 1) {
                this.renderSpritesPartially(startScan, scanCount, true);
            }
            if (this.f_bgVisibility == 1) {
                var si = startScan << 8;
                var ei = (startScan + scanCount) << 8;
                if (ei > 0xF000) {
                    ei = 0xF000;
                }
                var buffer = this.buffer;
                var bgbuffer = this.bgbuffer;
                var pixrendered = this.pixrendered;
                for (var destIndex = si; destIndex < ei; destIndex++) {
                    if (pixrendered[destIndex] > 0xFF) {
                        buffer[destIndex] = bgbuffer[destIndex];
                    }
                }
            }
            if (this.f_spVisibility == 1) {
                this.renderSpritesPartially(startScan, scanCount, false);
            }
            this.validTileData = false;
        };
        PPU.prototype.renderBgScanline = function (bgbuffer, scan) {
            var baseTile = (this.regS === 0 ? 0 : 256);
            var destIndex = (scan << 8) - this.regFH;
            this.curNt = this.ntable1[this.cntV + this.cntV + this.cntH];
            this.cntHT = this.regHT;
            this.cntH = this.regH;
            this.curNt = this.ntable1[this.cntV + this.cntV + this.cntH];
            if (scan < 240 && (scan - this.cntFV) >= 0) {
                var tscanoffset = this.cntFV << 3;
                var scantile = this.scantile;
                var attrib = this.attrib;
                var ptTile = this.ptTile;
                var nameTable = this.nameTable;
                var imgPalette = this.imgPalette;
                var pixrendered = this.pixrendered;
                var targetBuffer = bgbuffer ? this.bgbuffer : this.buffer;
                var t, tpix, att, col;
                for (var tile = 0; tile < 32; tile++) {
                    if (scan >= 0) {
                        if (this.validTileData) {
                            t = scantile[tile];
                            if (typeof t === 'undefined') {
                                continue;
                            }
                            tpix = t.pix;
                            att = attrib[tile];
                        }
                        else {
                            t = ptTile[baseTile + nameTable[this.curNt].getTileIndex(this.cntHT, this.cntVT)];
                            if (typeof t === 'undefined') {
                                continue;
                            }
                            tpix = t.pix;
                            att = nameTable[this.curNt].getAttrib(this.cntHT, this.cntVT);
                            scantile[tile] = t;
                            attrib[tile] = att;
                        }
                        var sx = 0;
                        var x = (tile << 3) - this.regFH;
                        if (x > -8) {
                            if (x < 0) {
                                destIndex -= x;
                                sx = -x;
                            }
                            if (t.opaque[this.cntFV]) {
                                for (; sx < 8; sx++) {
                                    targetBuffer[destIndex] = imgPalette[tpix[tscanoffset + sx] + att];
                                    pixrendered[destIndex] |= 256;
                                    destIndex++;
                                }
                            }
                            else {
                                for (; sx < 8; sx++) {
                                    col = tpix[tscanoffset + sx];
                                    if (col !== 0) {
                                        targetBuffer[destIndex] = imgPalette[col + att];
                                        pixrendered[destIndex] |= 256;
                                    }
                                    destIndex++;
                                }
                            }
                        }
                    }
                    if (++this.cntHT == 32) {
                        this.cntHT = 0;
                        this.cntH++;
                        this.cntH %= 2;
                        this.curNt = this.ntable1[(this.cntV << 1) + this.cntH];
                    }
                }
                this.validTileData = true;
            }
            this.cntFV++;
            if (this.cntFV == 8) {
                this.cntFV = 0;
                this.cntVT++;
                if (this.cntVT == 30) {
                    this.cntVT = 0;
                    this.cntV++;
                    this.cntV %= 2;
                    this.curNt = this.ntable1[(this.cntV << 1) + this.cntH];
                }
                else if (this.cntVT == 32) {
                    this.cntVT = 0;
                }
                this.validTileData = false;
            }
        };
        PPU.prototype.renderSpritesPartially = function (startscan, scancount, bgPri) {
            if (this.f_spVisibility === 1) {
                for (var i = 0; i < 64; i++) {
                    if (this.bgPriority[i] == bgPri && this.sprX[i] >= 0 &&
                        this.sprX[i] < 256 && this.sprY[i] + 8 >= startscan &&
                        this.sprY[i] < startscan + scancount) {
                        if (this.f_spriteSize === 0) {
                            var srcy1 = 0;
                            var srcy2 = 8;
                            if (this.sprY[i] < startscan) {
                                srcy1 = startscan - this.sprY[i] - 1;
                            }
                            if (this.sprY[i] + 8 > startscan + scancount) {
                                srcy2 = startscan + scancount - this.sprY[i] + 1;
                            }
                            if (this.f_spPatternTable === 0) {
                                this.ptTile[this.sprTile[i]].render(this.buffer, 0, srcy1, 8, srcy2, this.sprX[i], this.sprY[i] + 1, this.sprCol[i], this.sprPalette, this.horiFlip[i], this.vertFlip[i], i, this.pixrendered);
                            }
                            else {
                                this.ptTile[this.sprTile[i] + 256].render(this.buffer, 0, srcy1, 8, srcy2, this.sprX[i], this.sprY[i] + 1, this.sprCol[i], this.sprPalette, this.horiFlip[i], this.vertFlip[i], i, this.pixrendered);
                            }
                        }
                        else {
                            var top = this.sprTile[i];
                            if ((top & 1) !== 0) {
                                top = this.sprTile[i] - 1 + 256;
                            }
                            var srcy1 = 0;
                            var srcy2 = 8;
                            if (this.sprY[i] < startscan) {
                                srcy1 = startscan - this.sprY[i] - 1;
                            }
                            if (this.sprY[i] + 8 > startscan + scancount) {
                                srcy2 = startscan + scancount - this.sprY[i];
                            }
                            this.ptTile[top + (this.vertFlip[i] ? 1 : 0)].render(this.buffer, 0, srcy1, 8, srcy2, this.sprX[i], this.sprY[i] + 1, this.sprCol[i], this.sprPalette, this.horiFlip[i], this.vertFlip[i], i, this.pixrendered);
                            srcy1 = 0;
                            srcy2 = 8;
                            if (this.sprY[i] + 8 < startscan) {
                                srcy1 = startscan - (this.sprY[i] + 8 + 1);
                            }
                            if (this.sprY[i] + 16 > startscan + scancount) {
                                srcy2 = startscan + scancount - (this.sprY[i] + 8);
                            }
                            this.ptTile[top + (this.vertFlip[i] ? 0 : 1)].render(this.buffer, 0, srcy1, 8, srcy2, this.sprX[i], this.sprY[i] + 1 + 8, this.sprCol[i], this.sprPalette, this.horiFlip[i], this.vertFlip[i], i, this.pixrendered);
                        }
                    }
                }
            }
        };
        PPU.prototype.checkSprite0 = function (scan) {
            this.spr0HitX = -1;
            this.spr0HitY = -1;
            var toffset;
            var tIndexAdd = (this.f_spPatternTable === 0 ? 0 : 256);
            var x, y, t, i;
            var bufferIndex;
            var col;
            var bgPri;
            x = this.sprX[0];
            y = this.sprY[0] + 1;
            if (this.f_spriteSize === 0) {
                if (y <= scan && y + 8 > scan && x >= -7 && x < 256) {
                    t = this.ptTile[this.sprTile[0] + tIndexAdd];
                    col = this.sprCol[0];
                    bgPri = this.bgPriority[0];
                    if (this.vertFlip[0]) {
                        toffset = 7 - (scan - y);
                    }
                    else {
                        toffset = scan - y;
                    }
                    toffset *= 8;
                    bufferIndex = scan * 256 + x;
                    if (this.horiFlip[0]) {
                        for (i = 7; i >= 0; i--) {
                            if (x >= 0 && x < 256) {
                                if (bufferIndex >= 0 && bufferIndex < 61440 &&
                                    this.pixrendered[bufferIndex] !== 0) {
                                    if (t.pix[toffset + i] !== 0) {
                                        this.spr0HitX = bufferIndex % 256;
                                        this.spr0HitY = scan;
                                        return true;
                                    }
                                }
                            }
                            x++;
                            bufferIndex++;
                        }
                    }
                    else {
                        for (i = 0; i < 8; i++) {
                            if (x >= 0 && x < 256) {
                                if (bufferIndex >= 0 && bufferIndex < 61440 &&
                                    this.pixrendered[bufferIndex] !== 0) {
                                    if (t.pix[toffset + i] !== 0) {
                                        this.spr0HitX = bufferIndex % 256;
                                        this.spr0HitY = scan;
                                        return true;
                                    }
                                }
                            }
                            x++;
                            bufferIndex++;
                        }
                    }
                }
            }
            else {
                if (y <= scan && y + 16 > scan && x >= -7 && x < 256) {
                    if (this.vertFlip[0]) {
                        toffset = 15 - (scan - y);
                    }
                    else {
                        toffset = scan - y;
                    }
                    if (toffset < 8) {
                        t = this.ptTile[this.sprTile[0] + (this.vertFlip[0] ? 1 : 0) + ((this.sprTile[0] & 1) !== 0 ? 255 : 0)];
                    }
                    else {
                        t = this.ptTile[this.sprTile[0] + (this.vertFlip[0] ? 0 : 1) + ((this.sprTile[0] & 1) !== 0 ? 255 : 0)];
                        if (this.vertFlip[0]) {
                            toffset = 15 - toffset;
                        }
                        else {
                            toffset -= 8;
                        }
                    }
                    toffset *= 8;
                    col = this.sprCol[0];
                    bgPri = this.bgPriority[0];
                    bufferIndex = scan * 256 + x;
                    if (this.horiFlip[0]) {
                        for (i = 7; i >= 0; i--) {
                            if (x >= 0 && x < 256) {
                                if (bufferIndex >= 0 && bufferIndex < 61440 && this.pixrendered[bufferIndex] !== 0) {
                                    if (t.pix[toffset + i] !== 0) {
                                        this.spr0HitX = bufferIndex % 256;
                                        this.spr0HitY = scan;
                                        return true;
                                    }
                                }
                            }
                            x++;
                            bufferIndex++;
                        }
                    }
                    else {
                        for (i = 0; i < 8; i++) {
                            if (x >= 0 && x < 256) {
                                if (bufferIndex >= 0 && bufferIndex < 61440 && this.pixrendered[bufferIndex] !== 0) {
                                    if (t.pix[toffset + i] !== 0) {
                                        this.spr0HitX = bufferIndex % 256;
                                        this.spr0HitY = scan;
                                        return true;
                                    }
                                }
                            }
                            x++;
                            bufferIndex++;
                        }
                    }
                }
            }
            return false;
        };
        PPU.prototype.writeMem = function (address, value) {
            this.vramMem[address] = value;
            if (address < 0x2000) {
                this.vramMem[address] = value;
                this.patternWrite(address, value);
            }
            else if (address >= 0x2000 && address < 0x23c0) {
                this.nameTableWrite(this.ntable1[0], address - 0x2000, value);
            }
            else if (address >= 0x23c0 && address < 0x2400) {
                this.attribTableWrite(this.ntable1[0], address - 0x23c0, value);
            }
            else if (address >= 0x2400 && address < 0x27c0) {
                this.nameTableWrite(this.ntable1[1], address - 0x2400, value);
            }
            else if (address >= 0x27c0 && address < 0x2800) {
                this.attribTableWrite(this.ntable1[1], address - 0x27c0, value);
            }
            else if (address >= 0x2800 && address < 0x2bc0) {
                this.nameTableWrite(this.ntable1[2], address - 0x2800, value);
            }
            else if (address >= 0x2bc0 && address < 0x2c00) {
                this.attribTableWrite(this.ntable1[2], address - 0x2bc0, value);
            }
            else if (address >= 0x2c00 && address < 0x2fc0) {
                this.nameTableWrite(this.ntable1[3], address - 0x2c00, value);
            }
            else if (address >= 0x2fc0 && address < 0x3000) {
                this.attribTableWrite(this.ntable1[3], address - 0x2fc0, value);
            }
            else if (address >= 0x3f00 && address < 0x3f20) {
                this.updatePalettes();
            }
        };
        PPU.prototype.updatePalettes = function () {
            var i;
            for (i = 0; i < 16; i++) {
                if (this.f_dispType === 0) {
                    this.imgPalette[i] = this.palTable.getEntry(this.vramMem[0x3f00 + i] & 63);
                }
                else {
                    this.imgPalette[i] = this.palTable.getEntry(this.vramMem[0x3f00 + i] & 32);
                }
            }
            for (i = 0; i < 16; i++) {
                if (this.f_dispType === 0) {
                    this.sprPalette[i] = this.palTable.getEntry(this.vramMem[0x3f10 + i] & 63);
                }
                else {
                    this.sprPalette[i] = this.palTable.getEntry(this.vramMem[0x3f10 + i] & 32);
                }
            }
        };
        PPU.prototype.patternWrite = function (address, value) {
            var tileIndex = Math.floor(address / 16);
            var leftOver = address % 16;
            if (leftOver < 8) {
                this.ptTile[tileIndex].setScanline(leftOver, value, this.vramMem[address + 8]);
            }
            else {
                this.ptTile[tileIndex].setScanline(leftOver - 8, this.vramMem[address - 8], value);
            }
        };
        PPU.prototype.nameTableWrite = function (index, address, value) {
            this.nameTable[index].tile[address] = value;
            this.checkSprite0(this.scanline - 20);
        };
        PPU.prototype.attribTableWrite = function (index, address, value) {
            this.nameTable[index].writeAttrib(address, value);
        };
        PPU.prototype.spriteRamWriteUpdate = function (address, value) {
            var tIndex = Math.floor(address / 4);
            if (tIndex === 0) {
                this.checkSprite0(this.scanline - 20);
            }
            if (address % 4 === 0) {
                this.sprY[tIndex] = value;
            }
            else if (address % 4 == 1) {
                this.sprTile[tIndex] = value;
            }
            else if (address % 4 == 2) {
                this.vertFlip[tIndex] = ((value & 0x80) !== 0);
                this.horiFlip[tIndex] = ((value & 0x40) !== 0);
                this.bgPriority[tIndex] = ((value & 0x20) !== 0);
                this.sprCol[tIndex] = (value & 3) << 2;
            }
            else if (address % 4 == 3) {
                this.sprX[tIndex] = value;
            }
        };
        PPU.prototype.doNMI = function () {
            this.setStatusFlag(StatusFlag.VBLANK, true);
            this.cpu.requestIrq(InstructionRequest.NMI);
        };
        PPU.serializable = [
            'vramMem', 'spriteMem',
            'cntFV', 'cntV', 'cntH', 'cntVT', 'cntHT',
            'regFV', 'regV', 'regH', 'regVT', 'regHT', 'regFH', 'regS',
            'vramAddress', 'vramTmpAddress',
            'f_nmiOnVblank', 'f_spriteSize', 'f_bgPatternTable', 'f_spPatternTable',
            'f_addrInc', 'f_nTblAddress', 'f_color', 'f_spVisibility',
            'f_bgVisibility', 'f_spClipping', 'f_bgClipping', 'f_dispType',
            'vramBufferedReadValue', 'firstWrite',
            'currentMirroring', 'vramMirrorTable', 'ntable1',
            'sramAddress',
            'hitSpr0',
            'sprPalette', 'imgPalette',
            'curX', 'scanline', 'lastRenderedScanline', 'curNt', 'scantile',
            'attrib', 'buffer', 'bgbuffer', 'pixrendered',
            'requestEndFrame', 'nmiOk', 'dummyCycleToggle', 'nmiCounter',
            'validTileData', 'scanlineAlreadyRendered'
        ];
        return PPU;
    }());
    ;
    var NameTable = /** @class */ (function () {
        function NameTable(width, height, name) {
            this.width = width;
            this.height = height;
            this.name = name;
            this.tile = new Array(width * height);
            this.attrib = new Array(width * height);
            for (var i = 0; i < width * height; i += 1) {
                this.tile[i] = 0;
                this.attrib[i] = 0;
            }
        }
        Object.defineProperty(NameTable.prototype, "serializable", {
            get: function () {
                return NameTable.serializable;
            },
            enumerable: true,
            configurable: true
        });
        NameTable.prototype.getTileIndex = function (x, y) {
            return this.tile[y * this.width + x];
        };
        NameTable.prototype.getAttrib = function (x, y) {
            return this.attrib[y * this.width + x];
        };
        NameTable.prototype.writeAttrib = function (index, value) {
            var basex = (index % 8) * 4;
            var basey = Math.floor(index / 8) * 4;
            var add;
            var tx, ty;
            var attindex;
            for (var sqy = 0; sqy < 2; sqy++) {
                for (var sqx = 0; sqx < 2; sqx++) {
                    add = (value >> (2 * (sqy * 2 + sqx))) & 3;
                    for (var y = 0; y < 2; y++) {
                        for (var x = 0; x < 2; x++) {
                            tx = basex + sqx * 2 + x;
                            ty = basey + sqy * 2 + y;
                            attindex = ty * this.width + tx;
                            this.attrib[ty * this.width + tx] = (add << 2) & 12;
                        }
                    }
                }
            }
        };
        NameTable.serializable = [
            'tile',
            'attrib'
        ];
        return NameTable;
    }());
    var PaletteTable = /** @class */ (function () {
        function PaletteTable() {
            this.curTable = new Array(64);
            this.emphTable = new Array(8);
            this.currentEmph = -1;
        }
        PaletteTable.prototype.loadNTSCPalette = function () {
            this.curTable = [0x525252, 0xB40000, 0xA00000, 0xB1003D, 0x740069, 0x00005B, 0x00005F, 0x001840, 0x002F10, 0x084A08, 0x006700, 0x124200, 0x6D2800, 0x000000, 0x000000, 0x000000, 0xC4D5E7, 0xFF4000, 0xDC0E22, 0xFF476B, 0xD7009F, 0x680AD7, 0x0019BC, 0x0054B1, 0x006A5B, 0x008C03, 0x00AB00, 0x2C8800, 0xA47200, 0x000000, 0x000000, 0x000000, 0xF8F8F8, 0xFFAB3C, 0xFF7981, 0xFF5BC5, 0xFF48F2, 0xDF49FF, 0x476DFF, 0x00B4F7, 0x00E0FF, 0x00E375, 0x03F42B, 0x78B82E, 0xE5E218, 0x787878, 0x000000, 0x000000, 0xFFFFFF, 0xFFF2BE, 0xF8B8B8, 0xF8B8D8, 0xFFB6FF, 0xFFC3FF, 0xC7D1FF, 0x9ADAFF, 0x88EDF8, 0x83FFDD, 0xB8F8B8, 0xF5F8AC, 0xFFFFB0, 0xF8D8F8, 0x000000, 0x000000];
            this.makeTables();
            this.setEmphasis(0);
        };
        PaletteTable.prototype.loadPALPalette = function () {
            this.curTable = [0x525252, 0xB40000, 0xA00000, 0xB1003D, 0x740069, 0x00005B, 0x00005F, 0x001840, 0x002F10, 0x084A08, 0x006700, 0x124200, 0x6D2800, 0x000000, 0x000000, 0x000000, 0xC4D5E7, 0xFF4000, 0xDC0E22, 0xFF476B, 0xD7009F, 0x680AD7, 0x0019BC, 0x0054B1, 0x006A5B, 0x008C03, 0x00AB00, 0x2C8800, 0xA47200, 0x000000, 0x000000, 0x000000, 0xF8F8F8, 0xFFAB3C, 0xFF7981, 0xFF5BC5, 0xFF48F2, 0xDF49FF, 0x476DFF, 0x00B4F7, 0x00E0FF, 0x00E375, 0x03F42B, 0x78B82E, 0xE5E218, 0x787878, 0x000000, 0x000000, 0xFFFFFF, 0xFFF2BE, 0xF8B8B8, 0xF8B8D8, 0xFFB6FF, 0xFFC3FF, 0xC7D1FF, 0x9ADAFF, 0x88EDF8, 0x83FFDD, 0xB8F8B8, 0xF5F8AC, 0xFFFFB0, 0xF8D8F8, 0x000000, 0x000000];
            this.makeTables();
            this.setEmphasis(0);
        };
        PaletteTable.prototype.makeTables = function () {
            var r, g, b, col, i, rFactor, gFactor, bFactor;
            for (var emph = 0; emph < 8; emph++) {
                rFactor = 1.0;
                gFactor = 1.0;
                bFactor = 1.0;
                if ((emph & 1) !== 0) {
                    rFactor = 0.75;
                    bFactor = 0.75;
                }
                if ((emph & 2) !== 0) {
                    rFactor = 0.75;
                    gFactor = 0.75;
                }
                if ((emph & 4) !== 0) {
                    gFactor = 0.75;
                    bFactor = 0.75;
                }
                this.emphTable[emph] = new Array(64);
                for (i = 0; i < 64; i++) {
                    col = this.curTable[i];
                    r = Math.floor(this.getRed(col) * rFactor);
                    g = Math.floor(this.getGreen(col) * gFactor);
                    b = Math.floor(this.getBlue(col) * bFactor);
                    this.emphTable[emph][i] = this.getRgb(r, g, b);
                }
            }
        };
        PaletteTable.prototype.setEmphasis = function (emph) {
            if (emph != this.currentEmph) {
                this.currentEmph = emph;
                for (var i = 0; i < 64; i++) {
                    this.curTable[i] = this.emphTable[emph][i];
                }
            }
        };
        PaletteTable.prototype.getEntry = function (yiq) {
            return this.curTable[yiq];
        };
        PaletteTable.prototype.getRed = function (rgb) {
            return (rgb >> 16) & 0xFF;
        };
        PaletteTable.prototype.getGreen = function (rgb) {
            return (rgb >> 8) & 0xFF;
        };
        PaletteTable.prototype.getBlue = function (rgb) {
            return rgb & 0xFF;
        };
        PaletteTable.prototype.getRgb = function (r, g, b) {
            return ((r << 16) | (g << 8) | (b));
        };
        PaletteTable.prototype.loadDefaultPalette = function () {
            this.curTable[0] = this.getRgb(117, 117, 117);
            this.curTable[1] = this.getRgb(39, 27, 143);
            this.curTable[2] = this.getRgb(0, 0, 171);
            this.curTable[3] = this.getRgb(71, 0, 159);
            this.curTable[4] = this.getRgb(143, 0, 119);
            this.curTable[5] = this.getRgb(171, 0, 19);
            this.curTable[6] = this.getRgb(167, 0, 0);
            this.curTable[7] = this.getRgb(127, 11, 0);
            this.curTable[8] = this.getRgb(67, 47, 0);
            this.curTable[9] = this.getRgb(0, 71, 0);
            this.curTable[10] = this.getRgb(0, 81, 0);
            this.curTable[11] = this.getRgb(0, 63, 23);
            this.curTable[12] = this.getRgb(27, 63, 95);
            this.curTable[13] = this.getRgb(0, 0, 0);
            this.curTable[14] = this.getRgb(0, 0, 0);
            this.curTable[15] = this.getRgb(0, 0, 0);
            this.curTable[16] = this.getRgb(188, 188, 188);
            this.curTable[17] = this.getRgb(0, 115, 239);
            this.curTable[18] = this.getRgb(35, 59, 239);
            this.curTable[19] = this.getRgb(131, 0, 243);
            this.curTable[20] = this.getRgb(191, 0, 191);
            this.curTable[21] = this.getRgb(231, 0, 91);
            this.curTable[22] = this.getRgb(219, 43, 0);
            this.curTable[23] = this.getRgb(203, 79, 15);
            this.curTable[24] = this.getRgb(139, 115, 0);
            this.curTable[25] = this.getRgb(0, 151, 0);
            this.curTable[26] = this.getRgb(0, 171, 0);
            this.curTable[27] = this.getRgb(0, 147, 59);
            this.curTable[28] = this.getRgb(0, 131, 139);
            this.curTable[29] = this.getRgb(0, 0, 0);
            this.curTable[30] = this.getRgb(0, 0, 0);
            this.curTable[31] = this.getRgb(0, 0, 0);
            this.curTable[32] = this.getRgb(255, 255, 255);
            this.curTable[33] = this.getRgb(63, 191, 255);
            this.curTable[34] = this.getRgb(95, 151, 255);
            this.curTable[35] = this.getRgb(167, 139, 253);
            this.curTable[36] = this.getRgb(247, 123, 255);
            this.curTable[37] = this.getRgb(255, 119, 183);
            this.curTable[38] = this.getRgb(255, 119, 99);
            this.curTable[39] = this.getRgb(255, 155, 59);
            this.curTable[40] = this.getRgb(243, 191, 63);
            this.curTable[41] = this.getRgb(131, 211, 19);
            this.curTable[42] = this.getRgb(79, 223, 75);
            this.curTable[43] = this.getRgb(88, 248, 152);
            this.curTable[44] = this.getRgb(0, 235, 219);
            this.curTable[45] = this.getRgb(0, 0, 0);
            this.curTable[46] = this.getRgb(0, 0, 0);
            this.curTable[47] = this.getRgb(0, 0, 0);
            this.curTable[48] = this.getRgb(255, 255, 255);
            this.curTable[49] = this.getRgb(171, 231, 255);
            this.curTable[50] = this.getRgb(199, 215, 255);
            this.curTable[51] = this.getRgb(215, 203, 255);
            this.curTable[52] = this.getRgb(255, 199, 255);
            this.curTable[53] = this.getRgb(255, 199, 219);
            this.curTable[54] = this.getRgb(255, 191, 179);
            this.curTable[55] = this.getRgb(255, 219, 171);
            this.curTable[56] = this.getRgb(255, 231, 163);
            this.curTable[57] = this.getRgb(227, 255, 163);
            this.curTable[58] = this.getRgb(171, 243, 191);
            this.curTable[59] = this.getRgb(179, 255, 207);
            this.curTable[60] = this.getRgb(159, 255, 243);
            this.curTable[61] = this.getRgb(0, 0, 0);
            this.curTable[62] = this.getRgb(0, 0, 0);
            this.curTable[63] = this.getRgb(0, 0, 0);
            this.makeTables();
            this.setEmphasis(0);
        };
        return PaletteTable;
    }());
    var Tile = /** @class */ (function () {
        function Tile() {
            this.pix = new Array(64);
            this.opaque = new Array(8);
            this.initialized = false;
            this.fbIndex = null;
            this.tIndex = null;
            this.x = null;
            this.y = null;
            this.w = null;
            this.h = null;
            this.incX = null;
            this.incY = null;
            this.palIndex = null;
            this.tpri = null;
            this.c = null;
        }
        Object.defineProperty(Tile.prototype, "serializable", {
            get: function () {
                return Tile.serializable;
            },
            enumerable: true,
            configurable: true
        });
        Tile.prototype.setBuffer = function (scanline) {
            for (this.y = 0; this.y < 8; this.y += 1) {
                this.setScanline(this.y, scanline[this.y], scanline[this.y + 8]);
            }
        };
        Tile.prototype.setScanline = function (sline, b1, b2) {
            this.initialized = true;
            this.tIndex = sline << 3;
            for (this.x = 0; this.x < 8; this.x += 1) {
                this.pix[this.tIndex + this.x] = ((b1 >> (7 - this.x)) & 1) + (((b2 >> (7 - this.x)) & 1) << 1);
                if (this.pix[this.tIndex + this.x] === 0) {
                    this.opaque[sline] = false;
                }
            }
        };
        Tile.prototype.render = function (buffer, srcx1, srcy1, srcx2, srcy2, dx, dy, palAdd, palette, flipHorizontal, flipVertical, pri, priTable) {
            if (dx < -7 || dx >= 256 || dy < -7 || dy >= 240) {
                return;
            }
            this.w = srcx2 - srcx1;
            this.h = srcy2 - srcy1;
            if (dx < 0) {
                srcx1 -= dx;
            }
            if (dx + srcx2 >= 256) {
                srcx2 = 256 - dx;
            }
            if (dy < 0) {
                srcy1 -= dy;
            }
            if (dy + srcy2 >= 240) {
                srcy2 = 240 - dy;
            }
            if (!flipHorizontal && !flipVertical) {
                this.fbIndex = (dy << 8) + dx;
                this.tIndex = 0;
                for (this.y = 0; this.y < 8; this.y += 1) {
                    for (this.x = 0; this.x < 8; this.x += 1) {
                        if (this.x >= srcx1 && this.x < srcx2 && this.y >= srcy1 && this.y < srcy2) {
                            this.palIndex = this.pix[this.tIndex];
                            this.tpri = priTable[this.fbIndex];
                            if (this.palIndex !== 0 && pri <= (this.tpri & 0xFF)) {
                                buffer[this.fbIndex] = palette[this.palIndex + palAdd];
                                this.tpri = (this.tpri & 0xF00) | pri;
                                priTable[this.fbIndex] = this.tpri;
                            }
                        }
                        this.fbIndex += 1;
                        this.tIndex += 1;
                    }
                    this.fbIndex -= 8;
                    this.fbIndex += 256;
                }
            }
            else if (flipHorizontal && !flipVertical) {
                this.fbIndex = (dy << 8) + dx;
                this.tIndex = 7;
                for (this.y = 0; this.y < 8; this.y++) {
                    for (this.x = 0; this.x < 8; this.x++) {
                        if (this.x >= srcx1 && this.x < srcx2 && this.y >= srcy1 && this.y < srcy2) {
                            this.palIndex = this.pix[this.tIndex];
                            this.tpri = priTable[this.fbIndex];
                            if (this.palIndex !== 0 && pri <= (this.tpri & 0xFF)) {
                                buffer[this.fbIndex] = palette[this.palIndex + palAdd];
                                this.tpri = (this.tpri & 0xF00) | pri;
                                priTable[this.fbIndex] = this.tpri;
                            }
                        }
                        this.fbIndex++;
                        this.tIndex--;
                    }
                    this.fbIndex -= 8;
                    this.fbIndex += 256;
                    this.tIndex += 16;
                }
            }
            else if (flipVertical && !flipHorizontal) {
                this.fbIndex = (dy << 8) + dx;
                this.tIndex = 56;
                for (this.y = 0; this.y < 8; this.y++) {
                    for (this.x = 0; this.x < 8; this.x++) {
                        if (this.x >= srcx1 && this.x < srcx2 && this.y >= srcy1 && this.y < srcy2) {
                            this.palIndex = this.pix[this.tIndex];
                            this.tpri = priTable[this.fbIndex];
                            if (this.palIndex !== 0 && pri <= (this.tpri & 0xFF)) {
                                buffer[this.fbIndex] = palette[this.palIndex + palAdd];
                                this.tpri = (this.tpri & 0xF00) | pri;
                                priTable[this.fbIndex] = this.tpri;
                            }
                        }
                        this.fbIndex++;
                        this.tIndex++;
                    }
                    this.fbIndex -= 8;
                    this.fbIndex += 256;
                    this.tIndex -= 16;
                }
            }
            else {
                this.fbIndex = (dy << 8) + dx;
                this.tIndex = 63;
                for (this.y = 0; this.y < 8; this.y++) {
                    for (this.x = 0; this.x < 8; this.x++) {
                        if (this.x >= srcx1 && this.x < srcx2 && this.y >= srcy1 && this.y < srcy2) {
                            this.palIndex = this.pix[this.tIndex];
                            this.tpri = priTable[this.fbIndex];
                            if (this.palIndex !== 0 && pri <= (this.tpri & 0xFF)) {
                                buffer[this.fbIndex] = palette[this.palIndex + palAdd];
                                this.tpri = (this.tpri & 0xF00) | pri;
                                priTable[this.fbIndex] = this.tpri;
                            }
                        }
                        this.fbIndex++;
                        this.tIndex--;
                    }
                    this.fbIndex -= 8;
                    this.fbIndex += 256;
                }
            }
        };
        Tile.prototype.isTransparent = function (x, y) {
            return (this.pix[(y << 3) + x] === 0);
        };
        Tile.serializable = [
            'opaque',
            'pix'
        ];
        return Tile;
    }());
    var MirroringType;
    (function (MirroringType) {
        MirroringType[MirroringType["vertical"] = 0] = "vertical";
        MirroringType[MirroringType["horizontal"] = 1] = "horizontal";
        MirroringType[MirroringType["fourScreen"] = 2] = "fourScreen";
        MirroringType[MirroringType["singleScreen"] = 3] = "singleScreen";
        MirroringType[MirroringType["singleScreen2"] = 4] = "singleScreen2";
        MirroringType[MirroringType["singleScreen3"] = 5] = "singleScreen3";
        MirroringType[MirroringType["singleScreen4"] = 6] = "singleScreen4";
        MirroringType[MirroringType["chrRom"] = 7] = "chrRom";
    })(MirroringType || (MirroringType = {}));
    var Rom = /** @class */ (function () {
        function Rom(data) {
            var i;
            var j;
            var v;
            var bytes = new Uint8Array(data, 0, data.byteLength);
            if (bytes.length < 4 ||
                bytes[0] !== 0x4E ||
                bytes[1] !== 0x45 ||
                bytes[2] !== 0x53 ||
                bytes[3] !== 0x1A) {
                throw new Error('Not a valid NES rom.');
            }
            this.header = new Array(16);
            for (i = 0; i < 16; i += 1) {
                this.header[i] = bytes[i] & 0xFF;
            }
            this.romCount = this.header[4];
            if (this.romCount < 1) {
                throw new Error('No rom in this bank.');
            }
            this.vromCount = this.header[5] * 2;
            this.mirroring = (this.header[6] & 1) !== 0 ? 1 : 0;
            this.batteryRam = (this.header[6] & 2) !== 0;
            this.trainer = (this.header[6] & 4) !== 0;
            this.fourScreen = (this.header[6] & 8) !== 0;
            this.mapperType = (this.header[6] >> 4) | (this.header[7] & 0xF0);
            var foundError = false;
            for (i = 8; i < 16; i += 1) {
                if (this.header[i] !== 0) {
                    foundError = true;
                    break;
                }
            }
            if (foundError) {
                this.mapperType &= 0xF;
            }
            this.rom = new Array(this.romCount);
            var offset = 16;
            for (i = 0; i < this.romCount; i += 1) {
                this.rom[i] = new Array(16384);
                for (j = 0; j < 16384; j += 1) {
                    if (offset + j >= bytes.length) {
                        break;
                    }
                    this.rom[i][j] = bytes[offset + j];
                }
                offset += 16384;
            }
            this.vrom = new Array(this.vromCount);
            for (i = 0; i < this.vromCount; i += 1) {
                this.vrom[i] = new Array(4096);
                for (j = 0; j < 4096; j += 1) {
                    if (offset + j >= bytes.length) {
                        break;
                    }
                    this.vrom[i][j] = bytes[offset + j];
                }
                offset += 4096;
            }
            this.vromTile = new Array(this.vromCount);
            for (i = 0; i < this.vromCount; i += 1) {
                this.vromTile[i] = new Array(256);
                for (j = 0; j < 256; j += 1) {
                    this.vromTile[i][j] = new Tile();
                }
            }
            var tileIndex;
            var leftOver;
            for (v = 0; v < this.vromCount; v += 1) {
                for (i = 0; i < 4096; i += 1) {
                    tileIndex = i >> 4;
                    leftOver = i % 16;
                    if (leftOver < 8) {
                        this.vromTile[v][tileIndex].setScanline(leftOver, this.vrom[v][i], this.vrom[v][i + 8]);
                    }
                    else {
                        this.vromTile[v][tileIndex].setScanline(leftOver - 8, this.vrom[v][i - 8], this.vrom[v][i]);
                    }
                }
            }
        }
        Object.defineProperty(Rom.prototype, "mirroringType", {
            get: function () {
                if (this.fourScreen) {
                    return MirroringType.fourScreen;
                }
                if (this.mirroring === 0) {
                    return MirroringType.horizontal;
                }
                return MirroringType.vertical;
            },
            enumerable: true,
            configurable: true
        });
        return Rom;
    }());
    var System = /** @class */ (function () {
        function System(rom, onsample, onerror) {
            var _this = this;
            this.onsample = onsample;
            this.onerror = onerror;
            this.videoBuffer = new Array(256 * 240);
            this.audioBuffer = [];
            this.cpu = new CPU(null);
            this.ppu = new PPU(this.cpu, function (buffer) {
                for (var i = 0; i < 256 * 240; i += 1) {
                    _this.videoBuffer[i] = buffer[i];
                }
            });
            this.apu = new APU(this.cpu, function (sample) {
                _this.audioBuffer.push(sample);
                if (_this.onsample) {
                    _this.onsample(sample);
                }
            });
            this.controller = new Controller();
            this.cpu.mapper = Mapper.create(this.cpu, this.ppu, this.apu, this.controller, rom);
            this.ppu.setMirroring(rom.mirroringType);
        }
        System.romSupported = function (rom) {
            return Mapper.romSupported(rom);
        };
        System.prototype.buttonDown = function (player, button) {
            this.controller.buttonDown(player, button);
        };
        System.prototype.buttonUp = function (player, button) {
            this.controller.buttonUp(player, button);
        };
        System.prototype.frame = function () {
            this.controller.frame();
            this.ppu.startFrame();
            var cycles = 0;
            var cpu = this.cpu;
            var ppu = this.ppu;
            var apu = this.apu;
            FRAMELOOP: for (;;) {
                if (cpu.cyclesToHalt === 0) {
                    try {
                        cycles = cpu.emulate();
                    }
                    catch (error) {
                        if (this.onerror) {
                            this.onerror(error);
                        }
                        return false;
                    }
                    apu.clockFrameCounter(cycles);
                    cycles *= 3;
                }
                else {
                    if (cpu.cyclesToHalt > 8) {
                        cycles = 24;
                        apu.clockFrameCounter(8);
                        cpu.cyclesToHalt -= 8;
                    }
                    else {
                        cycles = cpu.cyclesToHalt * 3;
                        apu.clockFrameCounter(cpu.cyclesToHalt);
                        cpu.cyclesToHalt = 0;
                    }
                }
                // Include DMA/DMC halt time, VBlank, and disabled rendering.
                if (cpu.mapper.clockCpuCycles) cpu.mapper.clockCpuCycles(cycles / 3);
                for (; cycles > 0; cycles -= 1) {
                    if (ppu.curX === ppu.spr0HitX &&
                        ppu.f_spVisibility === 1 &&
                        ppu.scanline - 21 === ppu.spr0HitY) {
                        ppu.setStatusFlag(StatusFlag.SPRITE0HIT, true);
                    }
                    if (ppu.requestEndFrame) {
                        ppu.nmiCounter -= 1;
                        if (ppu.nmiCounter === 0) {
                            ppu.requestEndFrame = false;
                            ppu.startVBlank();
                            break FRAMELOOP;
                        }
                    }
                    ppu.curX += 1;
                    if (ppu.curX === 341) {
                        ppu.curX = 0;
                        ppu.endScanline();
                    }
                }
            }
            return true;
        };
        System.prototype.pull = function () {
            var audio = this.audioBuffer;
            this.audioBuffer = [];
            return {
                video: this.videoBuffer,
                audio: audio
            };
        };
        return System;
    }());
});

return module.exports; })();
// The create_fceumm factory is inserted immediately before this adapter.
const BUTTONS = { b: 0, select: 2, start: 3, u: 4, d: 5, l: 6, r: 7, a: 8 };
const OUTPUT_RATE = 44100;
let binaryPromise;
function wasmBytes() {
    if (!binaryPromise) {
        if (nodeRequire) binaryPromise = Promise.resolve(nodeRequire('fs').readFileSync(moduleDirectory + '/fceumm_libretro.wasm'));
        else binaryPromise = fetch(new URL('cdn/tsnes/dist/fceumm_libretro.wasm', document.baseURI).href)
            .then(response => { if (!response.ok) throw new Error('Unable to download emulator core: HTTP ' + response.status); return response.arrayBuffer(); })
            .then(bytes => new Uint8Array(bytes));
        binaryPromise = binaryPromise.catch(error => { binaryPromise = null; throw error; });
    }
    return binaryPromise;
}
function validateRom(data) {
    const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    if (bytes.length < 16 || bytes[0] !== 78 || bytes[1] !== 69 || bytes[2] !== 83 || bytes[3] !== 26) throw new Error('Not a valid NES ROM.');
    const nes2 = (bytes[7] & 12) === 8;
    const size = (low, high, unit) => high === 15 ? Math.pow(2, low >> 2) * ((low & 3) * 2 + 1) : (low + high * 256) * unit;
    const prg = size(bytes[4], nes2 ? bytes[9] & 15 : 0, 16384);
    const chr = size(bytes[5], nes2 ? bytes[9] >> 4 : 0, 8192);
    if (!prg || bytes.length < 16 + (bytes[6] & 4 ? 512 : 0) + prg + chr) throw new Error('Truncated NES ROM.');
    return bytes;
}
// This translated homebrew depends on the old core's MMC3 behavior. Match its
// complete contents, never its filename or a broad mapper family.
function needsLegacy(bytes) {
    if (bytes.length !== 57360) return false;
    let crc = 0xffffffff;
    for (const value of bytes) {
        crc ^= value;
        for (let i = 0; i < 8; i++) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    return ((crc ^ 0xffffffff) >>> 0) === 3536066032;
}
class Emulator {
    constructor() {
        this.onsample = null;
        this.onerror = null;
        this.core = null;
        this.generation = 0;
        this.ready = false;
        this.inputs = [0, 0];
        this.turbo = [new Set(), new Set()];
        this.video = new Array(256 * 240).fill(0);
        this.audio = [];
        this.fps = 60;
    }
    async load(data) {
        const bytes = validateRom(data);
        this.dispose();
        if (needsLegacy(bytes)) {
            this.legacy = new LegacyCore.Emulator();
            this.legacy.onsample = sample => { if (this.onsample) this.onsample([sample]); };
            this.legacy.onerror = error => { this.ready = false; if (this.onerror) this.onerror(error); };
            this.legacy.load(bytes.slice().buffer);
            this.engine = 'tsnes (translated Super Snake compatibility)';
            this.fps = 60;
            this.ready = true;
            return;
        }
        this.engine = 'FCEUmm';
        const generation = this.generation;
        this.rom = new Uint8Array(bytes);
        const mod = await create_fceumm({ wasmBinary: await wasmBytes(), locateFile: () => 'fceumm_libretro.wasm',
            print: () => {}, printErr: () => {} });
        if (generation !== this.generation) return;
        this.core = mod;
        this.inputs = [0, 0];
        this.turbo = [new Set(), new Set()];
        this.frameNumber = 0;
        this.audio = [];
        this.phase = 0;
        this.nativeSamples = 0;
        this.previousSample = 0;
        this.nativeRate = 48000;
        this.pixelFormat = 0;
        this.callbacks = [];
        this.strings = new Map();
        const string = value => {
            if (!this.strings.has(value)) {
                const bytes = new TextEncoder().encode(value + '\0');
                const pointer = mod._malloc(bytes.length);
                mod.HEAPU8.set(bytes, pointer);
                this.strings.set(value, pointer);
            }
            return this.strings.get(value);
        };
        const callback = (fn, signature) => { const pointer = mod.addFunction(fn, signature); this.callbacks.push(pointer); return pointer; };
        const variables = new Map();
        const overrides = { fceumm_region: 'Auto', fceumm_overscan_h_left: '0', fceumm_overscan_h_right: '0',
            fceumm_overscan_v_top: '0', fceumm_overscan_v_bottom: '0', fceumm_sndquality: 'High' };
        const logger = callback(() => {}, 'viii');
        mod._retro_set_environment(callback((command, pointer) => {
            const cmd = command & ~0x10000;
            switch (cmd) {
                case 2: case 3: mod.setValue(pointer, 1, 'i8'); return 1;
                case 9: case 19: case 30: case 31: mod.setValue(pointer, string('/'), 'i32'); return 1;
                case 10: {
                    const format = mod.getValue(pointer, 'i32');
                    if (format < 0 || format > 2) return 0;
                    this.pixelFormat = format; return 1;
                }
                case 15: {
                    const key = mod.UTF8ToString(mod.getValue(pointer, 'i32'));
                    const value = overrides[key] || variables.get(key);
                    mod.setValue(pointer + 4, value ? string(value) : 0, 'i32');
                    return value ? 1 : 0;
                }
                case 16:
                    for (let ptr = pointer; mod.getValue(ptr, 'i32'); ptr += 8) {
                        const key = mod.UTF8ToString(mod.getValue(ptr, 'i32'));
                        const definition = mod.UTF8ToString(mod.getValue(ptr + 4, 'i32'));
                        variables.set(key, definition.slice(definition.indexOf(';') + 1).trim().split('|')[0]);
                    }
                    return 1;
                case 17: mod.setValue(pointer, 0, 'i8'); return 1;
                case 27: mod.setValue(pointer, logger, 'i32'); return 1;
                case 39: case 52: mod.setValue(pointer, 0, 'i32'); return 1;
                case 47: mod.setValue(pointer, 3, 'i32'); return 1;
                case 51: return 1;
                case 6: case 8: case 11: case 18: case 35: case 37: return 1;
                default: return 0;
            }
        }, 'iii'));
        mod._retro_set_video_refresh(callback((pointer, width, height, pitch) => {
            if (!pointer || pointer === -1) return;
            if (!width || !height || width > 2048 || height > 2048) throw new Error('Invalid core framebuffer.');
            // Normal NES output is 256x240. Retain the application's fixed video format.
            for (let y = 0; y < 240; y++) {
                const sy = Math.min(height - 1, Math.floor(y * height / 240));
                for (let x = 0; x < 256; x++) {
                    const sx = Math.min(width - 1, Math.floor(x * width / 256));
                    let r, g, b;
                    if (this.pixelFormat === 1) {
                        const pixel = mod.HEAPU32[(pointer + sy * pitch + sx * 4) >> 2];
                        r = (pixel >> 16) & 255; g = (pixel >> 8) & 255; b = pixel & 255;
                    } else {
                        const pixel = mod.HEAPU16[(pointer + sy * pitch + sx * 2) >> 1];
                        const greenBits = this.pixelFormat === 2 ? 63 : 31;
                        r = Math.round(((pixel >> (this.pixelFormat === 2 ? 11 : 10)) & 31) * 255 / 31);
                        g = Math.round(((pixel >> 5) & greenBits) * 255 / greenBits);
                        b = Math.round((pixel & 31) * 255 / 31);
                    }
                    this.video[y * 256 + x] = r | (g << 8) | (b << 16);
                }
            }
        }, 'viiii'));
        const sample = (left, right) => {
            const value = (left + right) / 65536;
            const index = this.nativeSamples++;
            while (this.phase <= index) {
                const fraction = Math.max(0, Math.min(1, this.phase - index + 1));
                this.audio.push(this.previousSample + (value - this.previousSample) * fraction);
                this.phase += this.nativeRate / OUTPUT_RATE;
            }
            this.previousSample = value;
        };
        mod._retro_set_audio_sample(callback(sample, 'vii'));
        mod._retro_set_audio_sample_batch(callback((pointer, frames) => {
            for (let i = 0; i < frames; i++) sample(mod.HEAP16[(pointer >> 1) + i * 2], mod.HEAP16[(pointer >> 1) + i * 2 + 1]);
            return frames;
        }, 'iii'));
        mod._retro_set_input_poll(callback(() => {}, 'v'));
        mod._retro_set_input_state(callback((port, device, index, id) => {
            if (device !== 1 || port > 1) return 0;
            let bits = this.inputs[port] || 0;
            if ((this.frameNumber % 4) < 2) for (const button of this.turbo[port]) bits |= 1 << button;
            return id === 256 ? bits : (bits >> id) & 1;
        }, 'iiiii'));
        mod._retro_init();
        this.initialized = true;
        mod._retro_set_controller_port_device(0, 1);
        mod._retro_set_controller_port_device(1, 1);
        // FCEUmm also opens the content path; provide a MEMFS file as well as bytes.
        mod.FS.writeFile('/game.nes', bytes);
        const dataPointer = mod._malloc(bytes.length);
        mod.HEAPU8.set(bytes, dataPointer);
        this.dataPointer = dataPointer;
        const info = mod._malloc(16);
        mod.setValue(info, string('/game.nes'), 'i32');
        mod.setValue(info + 4, dataPointer, 'i32');
        mod.setValue(info + 8, bytes.length, 'i32');
        mod.setValue(info + 12, 0, 'i32');
        const loaded = mod._retro_load_game(info);
        mod._free(info);
        if (!loaded) { this.dispose(); throw new Error('FCEUmm could not load this NES ROM.'); }
        this.ready = true;
        const av = mod._malloc(40);
        mod._retro_get_system_av_info(av);
        const sampleRate = mod.getValue(av + 32, 'double');
        const fps = mod.getValue(av + 24, 'double');
        if (sampleRate > 0) this.nativeRate = sampleRate;
        if (fps > 0) this.fps = fps;
        mod._free(av);
    }
    reset() {
        if (this.legacy) { this.legacy.reset(); return; }
        if (this.ready) { this.core._retro_reset(); this.inputs = [0, 0]; this.turbo = [new Set(), new Set()]; this.audio = []; }
    }
    buttonDown(player, button) {
        if (this.legacy) { this.legacy.buttonDown(player, button); return; }
        if (player !== 1 && player !== 2) return;
        if (button === 'A' || button === 'B') this.turbo[player - 1].add(button === 'A' ? 8 : 0);
        else if (BUTTONS[button] !== undefined) this.inputs[player - 1] |= 1 << BUTTONS[button];
    }
    buttonUp(player, button) {
        if (this.legacy) { this.legacy.buttonUp(player, button); return; }
        if (player !== 1 && player !== 2) return;
        if (button === 'A' || button === 'B') this.turbo[player - 1].delete(button === 'A' ? 8 : 0);
        else if (BUTTONS[button] !== undefined) this.inputs[player - 1] &= ~(1 << BUTTONS[button]);
    }
    frame() {
        if (!this.ready) return false;
        if (this.legacy) return this.legacy.frame();
        try {
            const audioStart = this.audio.length;
            this.core._retro_run(); this.frameNumber++;
            if (this.onsample && this.audio.length > audioStart) this.onsample(this.audio.slice(audioStart));
            return true;
        } catch (error) { this.ready = false; if (this.onerror) this.onerror(error); return false; }
    }
    pull() { if (this.legacy) return this.legacy.pull(); const audio = this.audio; this.audio = []; return { video: this.video, audio }; }
    dispose() {
        this.generation++;
        this.legacy = null;
        if (this.core) {
            if (this.ready) this.core._retro_unload_game();
            if (this.initialized) this.core._retro_deinit();
            for (const ptr of this.callbacks || []) this.core.removeFunction(ptr);
        }
        this.ready = false; this.initialized = false; this.core = null; this.audio = [];
    }
}

class Speaker {
    constructor() { this.buffer = []; this.onbufferunderrun = null; this.read = 0; }
    contextReady() {
        if (this.context) return true;
        if (typeof window === 'undefined') return false;
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return false;
        this.context = new Audio({ sampleRate: OUTPUT_RATE });
        this.context.resume().catch(() => {});
        return true;
    }
    push(sample) {
        if (!this.contextReady()) return;
        if (!this.processor) {
            this.processor = this.context.createScriptProcessor(1024, 0, 1);
            this.processor.onaudioprocess = event => {
                const output = event.outputBuffer.getChannelData(0);
                if (this.onbufferunderrun && this.buffer.length - this.read < output.length) this.onbufferunderrun(this.buffer.length - this.read, output.length);
                if (this.buffer.length - this.read > output.length * 3) this.read = this.buffer.length - output.length * 2;
                output.fill(0);
                const length = Math.min(output.length, this.buffer.length - this.read);
                for (let i = 0; i < length; i++) output[i] = this.buffer[this.read++];
                if (this.read > 8192) { this.buffer = this.buffer.slice(this.read); this.read = 0; }
            };
            this.processor.connect(this.context.destination);
        }
        const samples = typeof sample === 'number' ? [sample] : sample;
        for (const value of samples) this.buffer.push(value);
    }
    play(samples) {
        if (!this.contextReady()) return;
        const buffer = this.context.createBuffer(1, samples.length, OUTPUT_RATE);
        buffer.getChannelData(0).set(samples);
        const source = this.context.createBufferSource();
        source.buffer = buffer; source.connect(this.context.destination); source.start();
    }
    close() {
        if (this.processor) { this.processor.disconnect(); this.processor = null; }
        if (this.context) { this.context.close().catch(() => {}); this.context = null; }
        this.buffer = []; this.read = 0;
    }
}
exports.Emulator = Emulator;
exports.Speaker = Speaker;
exports.CORE_NAME = 'FCEUmm';
exports.CORE_VERSION = 'romdev-core-fceumm@0.13.2+nes-web.1';

});
