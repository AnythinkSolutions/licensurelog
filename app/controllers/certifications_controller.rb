class CertificationsController < ApplicationController

  before_action :set_certification, only: [:show, :edit, :update, :destroy]
  skip_before_filter :verify_authenticity_token

  before_filter :authenticate_user!

  # GET /certifications
  # GET /certifications.json
  def index
    @certifications = Certification.where(:user_id => current_user.id)
  end

  # GET /certifications/1
  # GET /certifications/1.json
  def show
    @certification = Certification.where(:id => params[:id], :user_id => current_user.id).first

    unless @certification.nil?
      @categories = Category.where(:parent_id => nil, :certification_id => params[:id]);
    end

  end

  # GET /certifications/new
  def new
    @certification = Certification.new
  end

  # GET /certifications/1/edit
  def edit
  end

  # POST /certifications
  # POST /certifications.json
  def create
    @certification = Certification.new(certification_params)
    @certification.user_id = current_user.id

    respond_to do |format|
      if @certification.save
        format.html { redirect_to @certification, notice: 'Certification was successfully created.' }
        format.json { render action: 'show', status: :created, location: @certification }
      else
        format.html { render action: 'new' }
        format.json { render json: @certification.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /certifications/1
  # PATCH/PUT /certifications/1.json
  def update
    respond_to do |format|
      #result = @certification.update(certification_params)

      unless @certification.user_id == current_user.id
        render json: "unauthorized", status: :unauthorized
        return
      end

      if @certification.update(certification_params)
        format.html { redirect_to @certification, notice: 'Certification was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @certification.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /certifications/1
  # DELETE /certifications/1.json
  def destroy

    unless @certification.user_id == current_user.id
      render json: "unauthorized", status: :unauthorized
      return
    end

    @certification.destroy
    respond_to do |format|
      format.html { redirect_to certifications_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_certification
      @certification = Certification.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def certification_params
      params.require(:certification).permit(:name, :description, :user_id, :begin_date, :goal_date, :expire_date, :notes)
    end
end
