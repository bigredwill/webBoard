class DrawingController < ApplicationController
  layout "application"

  respond_to :html, :json
  protect_from_forgery
  skip_before_action :verify_authenticity_token, if: :json_request?

  #root
  def index

  end

  #POST
  def create
    # render plain: params[:drawing]inspect
    # js = JSON.parse(params[:drawing])
    # js = params[:dataURI]
    # render plain: js
    # unless params[:drawing].nil?
      @drawing = Drawing.new
      @drawing.imgUrl = params[:dataURI]
      flash[:drawing_id] = @drawing.id if @drawing.save
      logger.debug @drawing.id
      # json_response = { :edit_url => edit_drawing_path(@drawing.id), :static_url => drawing_path(@drawing.id), :id => @drawing.id}.to_json
      # respond_to do |format|
      #   format.json { render :json => json_response }

      # end
    # end
  end

  #GET, new drawing
  def new 
    
  end

  #GET, edit drawing
  def edit
    @drawing = Drawing.find_by(id: params[:id])
    if @drawing.present?
      render layout: "static" and return
    end
    redirect_to action: error
  end

  #GET, show static drawing
  def show
    @drawing = Drawing.find_by(id: params[:id])
    if @drawing.present?
      render layout: "static" and return
    end
    redirect_to action: error
  end

  #PATCH update
  def update

  end

  #PUT
  def update

  end

  #DELETE
  def destroy

  end

  def error
    # render layout: "static" and return
  end

  protected

  def json_request?
    request.format.json?
  end



end
