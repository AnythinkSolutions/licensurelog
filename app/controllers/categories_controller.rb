class CategoriesController < ApplicationController
  before_action :set_category, only: [:show, :edit, :update, :destroy]
  skip_before_filter :verify_authenticity_token

  before_filter :authenticate_user!

  # GET /categories
  # GET /categories.json
  def index

    if(params[:flatten])
      @categories = Category.where(:user_id => current_user.id)
      render :index_flat
      return;
    else
      if params[:cert_id]
        @categories = Category.where(:user_id => current_user.id, :parent_id => nil, :certification_id => params[:cert_id]);
      else
        @categories = Category.where(:user_id => current_user.id, :parent_id => nil)
      end
    end
  end

  # GET /categories/1
  # GET /categories/1.json
  def show
  end

  # GET /categories/new
  def new
    @category = Category.new
  end

  # GET /categories/1/edit
  def edit
  end

  # POST /categories
  # POST /categories.json
  def create

    @category = Category.new(category_params)
    @category.user_id = current_user.id

    respond_to do |format|
      if @category.save
        format.html { redirect_to @category, notice: 'Category was successfully created.' }
        format.json { render action: 'show', status: :created, location: @category }
      else
        format.html { render action: 'new' }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /categories/1
  # PATCH/PUT /categories/1.json
  def update

    unless @category.user_id == current_user.id
      render json: "unauthorized", status: :unauthorized
      return
    end

    respond_to do |format|
      if @category.update(category_params)
        format.html { redirect_to @category, notice: 'Category was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /categories/1
  # DELETE /categories/1.json
  def destroy

    unless @category.user_id == current_user.id
      render json: "unauthorized", status: :unauthorized
      return
    end

    @category.destroy
    respond_to do |format|
      format.html { redirect_to categories_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_category
      @category = Category.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def category_params
      params.require(:category).permit(:name, :description, :user_id, :required_hours, :parent_id, :certification_id, :cap, :is_group)
    end
end
