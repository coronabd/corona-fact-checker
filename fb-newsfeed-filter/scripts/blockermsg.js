let params = new URLSearchParams(window.location.search);
previous = params.get('from')
$('#okbutton').click(function()
{
  console.log("clicked")
  window.location.href = previous;
});