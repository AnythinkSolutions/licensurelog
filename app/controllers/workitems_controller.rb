class WorkitemsController < ApplicationController
  before_action :set_workitem, only: [:show, :edit, :update, :destroy]
  skip_before_filter :verify_authenticity_token

  before_filter :authenticate_user!

  # GET /workitems
  # GET /workitems.json
  def index

    if params[:certification_id]
      @workitems = Workitem.where(:certification_id => params[:certification_id])
    else
      @workitems = Workitem.all
    end

  end

  # GET /workitems/1
  # GET /workitems/1.json
  def show
  end

  # GET /workitems/new
  def new
    @workitem = Workitem.new
  end

  # GET /workitems/1/edit
  def edit
  end

  # POST /workitems/addoredit
  def add_or_update

    all_good = true
    error = nil

    begin

    items = params[:_json]
    items.each do |i|

      wi = Workitem.new(i)
      wi.user_id = 1   #TODO: Implement User Management

      #check to make sure it's not put into a grouping item
      if wi.category.is_group
        render json: 'Work cannot be added to a group category', status: :unprocessable_entity
        return
      end

      existing = Workitem.where(:user_id => wi.user_id, :category_id => wi.category_id, :date => wi.date).first

      if existing
        existing.hours = wi.hours
        existing.notes = wi.notes
        existing.save
      else
        wi.save
      end

    end

    rescue Exception => ex
      all_good = false
      error = ex
    end

    respond_to do |format|
      if all_good
        format.html { redirect_to @workitem, notice: 'Hour(s) successfully created or updated.' }
        format.json { render json: 'Hour(s) successfully created or updated.', status: :created }
      else
        format.html { render action: 'new' }
        format.json { render json: error, status: :unprocessable_entity }
      end
    end

  end

  # POST /workitems
  # POST /workitems.json
  def create

    #@workitem = Workitem.new(workitem_params)

    respond_to do |format|
      if @workitem.save
        format.html { redirect_to @workitem, notice: 'Workitem was successfully created.' }
        format.json { render action: 'show', status: :created, location: @workitem }
      else
        format.html { render action: 'new' }
        format.json { render json: @workitem.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /workitems/1
  # PATCH/PUT /workitems/1.json
  def update
    respond_to do |format|
      if @workitem.update(workitem_params)
        format.html { redirect_to @workitem, notice: 'Workitem was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @workitem.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /workitems/1
  # DELETE /workitems/1.json
  def destroy
    @workitem.destroy
    respond_to do |format|
      format.html { redirect_to workitems_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_workitem
      @workitem = Workitem.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def workitem_params
      params.require(:workitem).permit(:date, :user_id, :category_id, :certification_id, :hours, :notes, :signed_off)
    end
end
