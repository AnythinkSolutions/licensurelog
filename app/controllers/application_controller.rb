class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #protect_from_forgery with: :exception

  protect_from_forgery

  after_filter  :set_csrf_cookie_for_ng

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  protected

  def verified_request?
    super || form_authenticity_token == request.headers['HTTP_X_XSRF_TOKEN']
  end

  #def configure_permitted_parameters
  #  devise_parameter_sanitizer.for(:account_update) do |u|
  #    u.permit(:name, :email)
  #  end
  #end

end