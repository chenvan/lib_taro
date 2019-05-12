import Taro, { Component } from '@tarojs/taro'
import { View, Form, Input, Button, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import logoSrc from '../../assert/logo.png'
import './index.scss'


@inject('user')
@observer
export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { 
    Taro.setNavigationBarTitle({
      title: this.$router.params.isChangePWD ? '更改密码' : '登录'
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  checkInput = data => {
    
    let isChangePWD = this.$router.params.isChangePWD
    
    Object.keys(data).forEach(key => {
      if (data[key].trim() === '') {
        throw Error(key)
      }
    })

    if (isChangePWD) {
      if (data.newPWD.trim().length < 6) {
        throw Error('新密码长度不能小于6')
      } else if (data.newPWD.trim() !== data.confirmPWD.trim()) {
        throw Error('确认密码与新密码不一致')
      }
    }
  }

  userCloudFunc = rawData => {
    let isChangePWD = this.$router.params.isChangePWD,
        type = isChangePWD ? 'changePWD' : 'login',
        data = isChangePWD ? {
            _id: '001960',
            pwd: rawData.pwd.trim(),
            newPWD: rawData.newPWD.trim()
          } : {
            _id: rawData._id.trim(),
            pwd: rawData.pwd.trim()
          }
    
    return  Taro.cloud.callFunction({
        name: 'user',
        data: {
          type,
          data
        }
      })
  }

  submit = async event => {
    let isChangePWD = this.$router.params.isChangePWD
    const { user } = this.props

    try {
      Taro.showLoading({
        title: '加载中...'
      })
      
      this.checkInput(event.detail.value)
      let res = await this.userCloudFunc(event.detail.value)
      
      if (res.result.error) {
        throw Error(res.result.error)
      } else {
        Taro.hideLoading()
        if (isChangePWD) {
          user.clearAll()
          Taro.reLaunch({
            url: '../index/index'
          })
        } else {
          user.set({
            '_id': event.detail.value._id.trim(),
            'name': res.result.name,
            'isAdmin': event.detail.value._id.trim() === 'admin',
            'loginDate': new Date()
          })
          Taro.redirectTo({
            url: '../index/index'
          })
        }
      }
    } catch (err) {
      Taro.hideLoading()
      console.log(err)
      this.onError(err)
    }
  }

  onError = err => {
    let isChangePWD = this.$router.params.isChangePWD,
        local = {
          '_id': '工号',
          'pwd': isChangePWD? '旧密码' : '密码',
          'newPWD': '新密码',
          'confirmPWD': '新密码确认',
        },
        cloud = {
          'cloud _id': '工号错误',
          'cloud pwd': '密码错误'
        },
        msg = err.message

    if (local[msg]) {
      msg = `${local[msg]}输入不能为空`
    } else if(cloud[msg]) {
      msg = cloud[msg]
    }
      
    Taro.showModal({
      title: '出错',
      content: msg
    })
  }

  render () {
    let isChangePWD = this.$router.params.isChangePWD
    return (
      <View class='root'>
        <View class='logo'>
          <Image
            class='logo-img'
            src={logoSrc}
            mode='widthFix'
          />
        </View>
        <Form
          onSubmit={this.submit}
        >
          {
            !isChangePWD && <Input 
              name='_id'
              placeholder='工号'
              class='input'
            />
          }
          <Input 
            name='pwd'
            password
            placeholder={isChangePWD ? '旧密码' : '密码'}
          />
          {
            isChangePWD && (
              <View>
                <Input
                  name='newPWD'
                  password
                  placeholder='新密码'
                />
                <Input
                  name='confirmPWD'
                  password
                  placeholder='新密码确认'
                />
              </View>
            )
          }
          <View>
            <Button formType='submit'>
              {isChangePWD ? '修改密码' : '登录'}
            </Button>
          </View>
        </Form>
      </View>
    )
  }
}
