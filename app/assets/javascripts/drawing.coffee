canvasWidth = 600
canvasHeight = 600
painting = false
strokeColor = "#1abc9c"
strokeWidth = 5
lineJoin = "round"

$(document).ready -> 

  $canvas = $('.canvas-container:first canvas')
  # $canvas is the jquery object
  # $canvas[0] refers to the actual canvas DOM element
  canvas = $canvas[0] #the actual 
  context = canvas.getContext "2d"
  backgroundDrawing = $('#hidden_image')
  

  $canvas.mousedown (e) =>
    painting = true
    offset = $canvas.offset()
    mouseX = e.pageX - offset.left
    mouseY = e.pageY - offset.top

    context.strokeStyle = strokeColor
    context.lineJoin = lineJoin
    context.lineWidth = strokeWidth
    context.beginPath()
    drawLineAt(mouseX,mouseY)
    return

  $canvas.mousemove (e) ->
    if painting
      offset = $canvas.offset()
      mouseX = e.pageX - offset.left
      mouseY = e.pageY - offset.top
      drawLineAt(mouseX, mouseY)
    return

  $canvas.mouseup (e) ->
    painting = false
    offset = $canvas.offset()
    mouseX = e.pageX - offset.left
    mouseY = e.pageY - offset.top
    drawLineAt(mouseX,mouseY)
    context.stroke()
    context.closePath()
    # loadImageToCanvas()
    return

  drawLineAt = (x,y) ->
    context.lineTo(x, y)
    context.moveTo(x, y)
    context.stroke()
    return

  resetCanvas = () ->
    context.clearRect(0, 0, canvas.width, canvas.height);
    # newImg = canvas.toDataURL()
    loadImageToCanvas(context, backgroundDrawing[0].src)
    return

  $('#clear-button').click ->
    resetCanvas();
    return

  $('#share-button').click ->
    saveCanvasImage();
    return

  $('#color-picker').change ->
    strokeColor = $('#color-picker').val();
    return

  $('.color').click ->
    strokeColor = $(this).css('background-color')
    console.log strokeColor
    $('.inner-size').css('background-color', strokeColor)
    return

  $('.size').click ->
    strokeWidth = 60 - (6*(Number($(this).children('div')[0].id.slice(1))-1));
    return

  $('#size-picker').change ->
    strokeWidth = $('#size-picker').val();
    return

  

  saveCanvasImage = () ->
    #ajax post canvas.toDataURL() base64string (png)
    #generate unique link (id) to 
    #could use this method in ruby http://stackoverflow.com/a/15461373
    console.log canvas.toDataURL()
    $.ajax 
      method: "POST"
      url: "/drawing/"
      data:
        dataURI: canvas.toDataURL()

      success: (data, textStatus, jqXHR) ->
        $('body')
          .empty()
          .append data
        console.log data
      error:  (jqXHR, textStatus, errorThrown) ->
        $('body').append "AJAX Error: #{textStatus}"
        
        
    return
  # load an Image src to the canvas
  # to be used with 
  loadImageToCanvas = (ctx, src) ->

    #idea
    #could set globalAlpha to 0.8 before drawing image, that way drawing fades over time
    imgObj = new Image()
    imgObj.onload = -> 
      ctx.drawImage this, 0, 0
      return 
    imgObj.src = src
    return

  # check if we have a background image loaded and put it on to canvas
  if backgroundDrawing.length
    loadImageToCanvas(context, backgroundDrawing[0].src)

  #since CoffeeScript implicitly returns the last line of a function
  #putting return cancels this out and no return statement is put in
  #hax
  return
