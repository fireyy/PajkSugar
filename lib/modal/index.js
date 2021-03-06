/**
 * Modal
 */

 var lastFocus = null;

 var THEME = {
 	small  : 'basicModal__small',
 	xclose : 'basicModal__xclose'
 }

 var dom = function(elem, multiple) {

   var elem = elem || "";

 	if (multiple===true) {
    return document.querySelectorAll('.basicModal ' + elem);
  }else{
    return document.querySelector('.basicModal ' + elem);
  }

 }

 var valid = function(data) {

  var data = data || {};

 	if (data.body==null)       data.body = '';
 	if (data.class==null)      data.class = '';
 	if (data.closable!==false) data.closable = true;

 	if (data.buttons==null) {
 		console.error('basicModal requires at least one button');
 		return false;
 	}

 	// Validate action-button
 	if (data.buttons.action!=null) {

 		if (data.buttons.action.class==null) data.buttons.action.class = '';
 		if (data.buttons.action.title==null) data.buttons.action.title = 'OK';

 		if (data.buttons.action.fn==null) {
 			console.error('Missing fn for action-button');
 			return false;
 		}

 	}

 	// Validate cancel-button
 	if (data.buttons.cancel!=null) {

 		if (data.buttons.cancel.class==null) data.buttons.cancel.class = '';
 		if (data.buttons.cancel.title==null) data.buttons.cancel.title = 'Cancel';

 		if (data.buttons.cancel.fn==null) {
 			console.error('Missing fn for cancel-button');
 			return false;
 		}

 	}

 	return true;

 }

 var build = function(data) {

 	var icon = '<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M405 136.798l-29.798-29.798-119.202 119.202-119.202-119.202-29.798 29.798 119.202 119.202-119.202 119.202 29.798 29.798 119.202-119.202 119.202 119.202 29.798-29.798-119.202-119.202z"/></svg>',
 	    html = '';

 	html += "  <div class='basicModalContainer basicModalContainer--fadeIn' data-closable='" + data.closable + "'>";
 	html += "   <div class='basicModal basicModal--fadeIn " + data.class + "' role='dialog'>";
 	html += "      <div class='basicModal__content'>" + data.body + "</div>";
 	html += "      <div class='basicModal__buttons'>";

 	// Cancel-button
 	if (data.buttons.cancel!=null) {
 		if (data.buttons.cancel.class.indexOf('basicModal__xclose')===-1) {

 			// Default close-button
 			html +=	"<a id='basicModal__cancel' class='basicModal__button " + data.buttons.cancel.class + "'>" + data.buttons.cancel.title + "</a>";

 		} else {

 			// Custom close-button for the login-theme
 			html += "<div id='basicModal__cancel' class='basicModal__button " + data.buttons.cancel.class + "' aria-label='close'>" + icon + "</div>";

 		}
 	}

 	// Action-button
 	if (data.buttons.action!=null) {

 		html += "<a id='basicModal__action' class='basicModal__button " + data.buttons.action.class + "'>" + data.buttons.action.title + "</a>";

 	}

 	html += "      </div>";
 	html += "    </div>";
 	html += "  </div>";

 	return html;

 }

 var getValues = function() {

 	var values = null,
 	    inputs = dom('input', true);

 	if (inputs.length>0) {

 		values = {};

 		// Get value from all inputs
 		for (var i = 0; i < inputs.length; ++i) {

 			var input = inputs[i],
 			    name  = input.getAttribute('name'),
 			    value = input.value;

 			// Store name and value of input
 			if (name!=null) values[name] = value;

 		}

 		// Set value back to null when object empty
 		if (Object.keys(values).length===0) values = null;

 	}

 	return values;

 }

 var bind = function(data) {

 	// Cancel-button
 	if (data.buttons.cancel!=null) {

 		dom('#basicModal__cancel').onclick = function() {

 			// Don't execute function when button has been clicked already
 			if (this.classList.contains('basicModal__button--active')===true) return false;

 			this.classList.add('basicModal__button--active');
 			data.buttons.cancel.fn();

 		}

 	}

 	// Action-button
 	if (data.buttons.action!=null) {

 		dom('#basicModal__action').onclick = function() {

 			// Don't execute function when button has been clicked already
 			if (this.classList.contains('basicModal__button--active')===true) return false;

 			this.classList.add('basicModal__button--active');
 			data.buttons.action.fn(getValues());

 		}

 	}

 	// Bind input
 	var inputs = dom('input', true);
 	for (var i = 0; i < inputs.length; ++i) { inputs[i].onkeydown = function() { this.classList.remove('error') } }

 	return true;

 }

 var show = function(data) {

 	if (data==null || Object.keys(data).length===0) return false;

 	// Save focused element
 	lastFocus = document.activeElement;

 	// Validate data and set default values
 	if (valid(data)===false) return false;

 	// Close open modal
 	if (dom()!=null) {
 		close(true);
 		setTimeout(function(){
      show(data);
    }, 301);
 		return false;
 	}

 	// Build and append modal to DOM
 	var html = build(data);
 	document.body.insertAdjacentHTML('beforeend', html);

 	// Bind elements
 	bind(data);

 	// Select the first input when available
 	var input = dom('input');
 	if (input!=null) input.select();

 	// Execute callback when available
 	if (data.callback!=null) data.callback(data);

 	return true;

 }

 var error = function(input) {

 	// Reactive buttons and remove old errors
 	reset();

 	var elem = dom("input[name='" + input + "']");

 	elem.classList.add('error');
 	elem.select();

 	// Shake input
 	dom().classList.remove('basicModal--fadeIn', 'basicModal--shake');
 	setTimeout(function(){
    dom().classList.add('basicModal--shake');
  }, 1);

 }

 var visible = function() {

 	if (dom()!=null) return true
 	return false

 }

 var action = function() {

 	var elem = dom('#basicModal__action')

 	if (elem!=null) {

 		elem.click()
 		return true

 	}

 	return false

 }

 var cancel = function() {

 	var elem = dom('#basicModal__cancel')

 	if (elem!=null) {

 		elem.click()
 		return true

 	}

 	return false

 }

 var reset = function() {

 	// Reactive buttons
 	var buttons = dom('.basicModal__button', true)
 	for (var i = 0; i < buttons.length; ++i) { buttons[i].classList.remove('basicModal__button--active') }

 	// Remove errors
 	var inputs = dom('input', true)
 	for (var i = 0; i < inputs.length; ++i) { inputs[i].classList.remove('error') }

 	return true

 }

 var close = function(force) {

 	// Only close when a modal is visible
 	if (visible()===false) return false

 	// Validate force
 	if (force!==true) force = false

 	// Get modal container
 	var container = dom().parentElement

 	// Don't close when modal not closable
 	// Use 'force===true' to close unclosebale modal
 	if (container.getAttribute('data-closable')==='false' && force===false) return false

 	container.classList.remove('basicModalContainer--fadeIn')
 	container.classList.add('basicModalContainer--fadeOut')

 	setTimeout(function(){
    container.parentNode.removeChild(container)
  }, 300)

 	// Restore last active element
 	if (lastFocus!=null) {
 		lastFocus.focus()
 		lastFocus = null
 	}

 	return true

 }

 module.exports = {
 	THEME: THEME,
 	show: show,
 	visible: visible,
 	getValues: getValues,
 	action: action,
 	cancel: cancel,
 	error: error,
 	reset: reset,
 	close: close
};
