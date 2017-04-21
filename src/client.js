var IO = (function(root, factory) {
	var client = io();
	factory.emit = function(handle, data) {
		/*通知server端创建一个net连接*/
		client.emit(handle, data);
	}
	factory.close = function(client, data) {
		/*通知server端关闭连接*/
		client.emit('close', data);
	}
	factory.on = function(handle, cb) {
		client.on(handle, cb);
	}
	return factory;
})(window, window.IO = window.IO || {});