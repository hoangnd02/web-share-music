import { Vue, Component } from 'vue-property-decorator';
import store from '~/controllers';
import ApiClient from '~/library/ApiClient';
import ZNotification from '@/library/z-notification'
import controllers from '~/controllers';
@Component({})
export class AuthMixin extends Vue {
  user: any = store.value.user || ''
  first_name: string = this.user.first_name || ''
  last_name: string = this.user.last_name || ''
  email: string = this.user.email || ''
  bio: string = this.user.bio || ''
  password: string = ""
  avatar: any = ''
  url: any = ''
  code: string = ''

  old_password: string = ''
  new_password: string = ''
  confirm_password: string = ''

  get email_error() {
    if (this.email.length === 0) return;

    const valid = (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email));

    if (!valid) return 'Vui lòng nhập chính xác email của bạn';
  }

  get first_name_error() {
    if (this.first_name.length === 0) return "Không được để trống";
  }

  get last_name_error() {
    if (this.last_name.length === 0) return "Không được để trống";
  }

  get password_error() {
    if (this.password.length === 0) return;

    return !this.validate_password(this.password) ? 'Mật khẩu cần ít nhất 8 ký tự trở lên' : null;
  }

  get old_password_error() {
    if (this.old_password.length === 0) return;

    return !this.validate_password(this.old_password) ? 'Mật khẩu cần ít nhất 8 ký tự trở lên' : null;
  }

  get new_password_error() {
    if (this.new_password.length === 0) return;
    if (this.new_password === this.old_password) return 'Mật khẩu mới phải khác mật khẩu cũ';

    return !this.validate_password(this.new_password) ? 'Mật khẩu cần ít nhất 8 ký tự trở lên' : null;
  }

  get confirm_password_error() {
    if (this.confirm_password.length === 0) return;

    return this.new_password !== this.confirm_password ? 'Mật khẩu không khớp' : null;
  }

  validate_password(password: string) {
    return password.length >= 8;
  }
  
  onImageChanged(event: any) {
    this.avatar = event.target.files[0];
    this.url = URL.createObjectURL(this.avatar);
  }

  async login() {
    if(this.email_error) return
    if (this.password.length === 0) return

    try {
      const { data } = await new ApiClient().post('identity/session', { email: this.email, password: this.password });
      ZNotification.success({
        title: "success",
        description: "Login successfully"
      })
      controllers.user.uid = data.uid
      controllers.user.bio = data.bio
      controllers.user.email = data.email
      controllers.user.first_name = data.first_name
      controllers.user.last_name = data.last_name
      controllers.user.role = data.role
      controllers.user.state = data.state
      this.$router.push({ path: '/' })
    } catch (error) {
      return error
    }
  }

  async logout() {    
    try {
        await new ApiClient().delete('identity/session');
        store.value.user.uid = null 
        store.value.user.email = null 
        store.value.user.first_name = null 
        store.value.user.last_name = null 
        store.value.user.role = null 
        store.value.user.bio = null 
        store.value.user.state = null 

        this.user = store.value.user
        this.$router.push({ path: '/' })
    } catch (error) {
        return error            
    }
  }

  async register() {
    if (this.first_name.length === 0) return;
    if (this.last_name.length === 0) return;
    if (this.email_error) return;
    if (this.password_error) return;
    try {
      await new ApiClient().post('identity/users',
      { 
        first_name: this.first_name, 
        last_name: this.last_name, 
        email: this.email, 
        password: this.password 
      });
      ZNotification.success({
        title: "success",
        description: "Register successfully"
      })
      this.$router.push({ path: '/' })
    } catch (error) {
      return error
    }
  }

  async sendEmailCode() {
    try {
      await new ApiClient().post('identity/users/generate_code',
      { 
       email: this.user.email
      });
      ZNotification.success({
        title: "success",
        description: "send OTP code successfully"
      })
    } catch (error) {
      return error
    }
  }

  async confirmEmail() {
    if(this.code.length <= 5) return
    
    try {
      await new ApiClient().post('identity/users/confirm_code',
      { 
        email: this.user.email, 
        code: this.code, 
      });
      this.$router.push({ path: '/' })
      ZNotification.success({
        title: "success",
        description: "Confirm email successfully"
      })
    } catch (error) {
      return(error);
    }
  }

  async updatedProfile() {
    if(this.first_name_error) return
    if(this.last_name_error) return

    const form = new FormData()
    form.set('first_name', this.first_name);
    form.set('last_name', this.last_name);
    form.set('bio', this.bio);
    form.set('avatar', this.avatar as File);
    try {
      await new ApiClient().put('resource/users', form);
      this.user.first_name = this.first_name
      this.user.last_name = this.last_name
      ZNotification.success({
        title: "success",
        description: "Create album successfully"
      })
    } catch (error) {
      return error
    }
  }

  async changePassword() {
    if (this.old_password_error) return;
    if (this.new_password_error) return;
    if (this.confirm_password_error) return;

    try {
      await new ApiClient().put('resource/users/password',
      { old_password: this.old_password, new_password: this.new_password,
        confirm_password: this.confirm_password
      }); 
      ZNotification.success({
        title: "success",
        description: "Change password successfully"
      })
      this.$router.push({ path: '/' })
    } catch (error) {
      return error
    }
  }

}
