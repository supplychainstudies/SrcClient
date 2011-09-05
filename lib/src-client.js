/* Copyright (C) Sourcemap 2011
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License along with this
 * program. If not, see <http://www.gnu.org/licenses/>.*/

function SrcClient() {
	
	this.API_VERSION = '1.0';
	this.API_ENDPOINT = 'http://www.sourcemap.com/services/';
	this.apikey = '';
	this.apisecret = '';
	
	this.init = function(key, secret) {
		this.apikey = key;
		this.apisecret = secret;
	}

	this.available = function(cbname) {
		this._get('', cbname);
	}

	this.supplychain = function(id, cbname) {
		this._get('supplychains/'+id, cbname);
	}

	this.supplychains = function(args, cbname) {
		if(args[0] && typeof(args[0]) == 'number') {
			var l = args[0];
			if(args[1]) { var o = args[1]; } else { var o = 0; }
			this._get('supplychains/', cbname, '?l='+l+'&o='+o+'&');		
		} else if(typeof(args[0]) == 'string') {
			this._get('search/', cbname, '?q='+args[0]+'&');		
		} else { throw 'Invalid Arguments'; }
	}

	this._get = function(service, cbname, get) {
		if(typeof(get) == 'undefined') { get = '?'; }
		var script = document.createElement('script');
		script.setAttribute('src', this.API_ENDPOINT+service+get+'f=jsonp&callback='+cbname);
		document.getElementsByTagName('head')[0].appendChild(script);
	}
}