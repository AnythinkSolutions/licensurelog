class RegistrationsController < Devise::RegistrationsController

  # POST /users
  # POST /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save

        license_id = params[:license].present? ? params[:license] : 0
        if license_id < 0
          Certification.create_from_template(@user.id, license_id)
        end

        format.html { redirect_to @user, notice: 'User was successfully created.' }
        format.json { render action: 'show', status: :created, location: @user }
      else
        format.html { render action: 'new' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

end