;(function(){
// JSON: JavaScript Object Notation
// YSON: Yielding javaScript Object Notation
var yson = {}, u, sI = setTimeout.turn || (typeof setImmediate != ''+u && setImmediate) || setTimeout;
yson.parseAsync = function(text, done, revive, M){
	var ctx = {i: 0, text: text, done: done, o: {}, l: text.length, up: []};
	ctx.at = ctx.o;
	//M = 1024 * 1024 * 100;
	//M = M || 1024 * 64;
	M = M || 1024 * 32;
	parse();
	function parse(){
		//var S = +new Date;
		var s = ctx.text, o = ctx.o;
		var i = ctx.i, l = ctx.l, j = 0;
		var w = ctx.w, b, tmp;
		while(j++ < M){
			var c = s[i++];
			if(i > l){
				ctx.end = true;
				break;
			}
			if(w){
				i = s.indexOf('"', i-1); c = s[i];
				tmp = '\\' == s[i-1];
				b = b || tmp;
				if('"' == c && !tmp){
					w = u;
					tmp = ctx.s;
					if(ctx.a){
						tmp = s.slice(ctx.sl, i);
						if(b){ tmp = JSON.parse('"'+tmp+'"') }
						if(ctx.at instanceof Array){
							ctx.at.push(ctx.s = tmp);
						} else {
							ctx.at[ctx.s] = ctx.s = tmp;
						}
					} else {
						ctx.s = s.slice(ctx.sl, i);
						if(b){ ctx.s = JSON.parse('"'+ctx.s+'"'); }
					}
					ctx.a = b = u;
				}
				++i;
			} else {
				switch(c){
				case '"':
					ctx.sl = i;
					w = true;
					break;
				case ':':
					ctx.ai = i;
					ctx.a = true;
					break;
				case ',':
					if(ctx.a || ctx.at instanceof Array){
						if(tmp = s.slice(ctx.ai, i-1)){
							if(u !== (tmp = value(tmp))){
								if(ctx.at instanceof Array){
									ctx.at.push(tmp);
								} else {
									ctx.at[ctx.s] = tmp;
								}
							}
						}
					}
					ctx.a = u;
					if(ctx.at instanceof Array){
						ctx.a = true;
						ctx.ai = i;
					}
					break;
				case '{':
					ctx.up.push(ctx.at);
					if(ctx.at instanceof Array){
						ctx.at.push(ctx.at = {});
					} else
					if(tmp = ctx.s){
						ctx.at[tmp] = ctx.at = {};
					}
					ctx.a = u;
					break;
				case '}':
					if(ctx.a){
						if(tmp = s.slice(ctx.ai, i-1)){
							if(u !== (tmp = value(tmp))){
								if(ctx.at instanceof Array){
									ctx.at.push(tmp);
								} else {
									ctx.at[ctx.s] = tmp;
								}
							}
						}
					}
					ctx.a = u;
					ctx.at = ctx.up.pop();
					break;
				case '[':
					if(tmp = ctx.s){
						ctx.up.push(ctx.at);
						ctx.at[tmp] = ctx.at = [];
					}
					ctx.a = true;
					break;
				case ']':
					if(ctx.a){
						if(tmp = s.slice(ctx.ai, i-1)){
							if(u !== (tmp = value(tmp))){
								if(ctx.at instanceof Array){
									ctx.at.push(tmp);
								} else {
									ctx.at[ctx.s] = tmp;
								}
							}
						}
					}
					ctx.a = u;
					ctx.at = ctx.up.pop();
					break;
				}
			}
		}
		ctx.i = i;
		ctx.w = w;
		//console.log("!!!!!!!!", +new Date - S, ctx.i, ctx.l);
		if(ctx.end){
			ctx.done(u, ctx.o);
		} else {
			//setTimeout.turn(parse);
			sI(parse);
		}
	}
}
function value(s){
	var n = parseFloat(s);
	if(!isNaN(n)){
		return n;
	}
	s = s.trim();
	if('true' == s){
		return true;
	}
	if('false' == s){
		return false;
	}
	if('null' == s){
		return null;
	}
}

yson.stringifyAsync = function(data, done, replacer, space, ctx){
	ctx = ctx || {};
	ctx.text = ctx.text || "";
	ctx.up = [ctx.at = {d: data}];
	ctx.done = done;
	ctx.i = 0;
	var j = 0;
	ify();
	function ify(){
		var at = ctx.at, data = at.d, tmp;
		//console.log(at.k, typeof data, data);
		if(at.i > 0){ ctx.text += ',' }
		if(u !== (tmp = at.k)){ ctx.text += '"'+tmp+'":' }
		switch(typeof data){
		case 'boolean':
			ctx.text += ''+data;
			break;
		case 'string':
			//ctx.text += JSON.stringify(data);
			ctx.text += '"'+data+'"';//JSON.stringify(data);
			break;
		case 'number':
			ctx.text += data;
			break;
		case 'object':
			if(!data){
				ctx.text += 'null';
				break;
			}
			if(data instanceof Array){	
				ctx.text += '[';
				at = {i: -1, as: data, up: at};
				at.l = data.length;
				ctx.up.push(ctx.at = at);
				break;
			}
			ctx.text += '{';
			at = {i: -1, ok: Object.keys(data).sort(), as: data, up: at};
			at.l = at.ok.length;
			ctx.up.push(ctx.at = at);
			break;
		}
		while(1+at.i >= at.l){
			ctx.text += (at.ok? '}' : ']');
			at = ctx.at = at.up;
		}
		if(++at.i < at.l){
			if(tmp = at.ok){
				at.d = at.as[at.k = tmp[at.i]];
			} else {
				at.d = at.as[at.i];
			}
			if(++j < 9){ return ify() } else { j = 0 }
			sI(ify);
			return;
		}
		ctx.done(u, ctx.text);
	}
}
if(typeof window != ''+u){ window.YSON = yson }
try{ if(typeof module != ''+u){ module.exports = yson } }catch(e){}

}());