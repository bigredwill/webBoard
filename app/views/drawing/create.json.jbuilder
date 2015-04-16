json.drawing do
  json.id @drawing.id
  json.edit_url edit_drawing_path(@drawing.id)
  json.static_url drawing_path(@drawing.id)
end