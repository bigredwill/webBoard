class DrawingController < ApplicationController
  layout "application"

  respond_to :html, :json
  protect_from_forgery
  skip_before_action :verify_authenticity_token, if: :json_request?

  #root
  def index
    logger.debug request.base_url
  end

  #POST
  def create
    @drawing = Drawing.new
    @drawing.imgUrl = params[:dataURI]
    flash[:base_url] = request.base_url if @drawing.save
  end

  #GET, new drawing
  def new 
  end

  #GET, edit drawing
  def edit
    @drawing = Drawing.find_by(id: params[:id])
    if @drawing.present?
      render layout: "application" and return
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
