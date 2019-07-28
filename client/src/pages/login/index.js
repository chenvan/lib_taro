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

  checkInput = (data, isChangePWD) => {
    // console.log(data)
    let transTable = {
          '_id': '工号',
          'pwd': isChangePWD? '旧密码' : '密码',
          'newPWD': '新密码',
          'confirmPWD': '新密码确认',
        }

    Object.keys(data).forEach(key => {
      if (data[key].trim() === '') {
        throw Error(`${transTable[key]}不能为空`)
      }
    })

    if (isChangePWD) {
      if (data.newPWD.length < 6) {
        throw Error('新密码长度不能小于6')
      } else if (data.newPWD !== data.confirmPWD) {
        throw Error('确认密码与新密码不一致')
      }
    }
  }

  callUserFunc = (rawData, isChangePWD) => {
    let type = isChangePWD ? 'changePWD' : 'login',
        data = isChangePWD ? {
            _id: this.props.user._id,
            pwd: rawData.pwd,
            newPWD: rawData.newPWD
          } : {
            _id: rawData._id,
            pwd: rawData.pwd
          }
    
    return Taro.cloud.callFunction({
        name: 'user',
        data: {type, data}
      })
  }

  // refreshBorrowing = () => {
  //   Taro.eventCenter.trigger('getBorrowingInfo')
  // }

  submit = async event => {
    let isChangePWD = this.$router.params.isChangePWD

    try {
      Taro.showLoading({
        title: '加载中...'
      })
      
      this.checkInput(event.detail.value, isChangePWD)
      let { result } = await this.callUserFunc(event.detail.value, isChangePWD)
      console.log('user info: ', result)
      Taro.hideLoading()

      if (isChangePWD) {
        let id = this.props.user._id
        await this.props.user.clearAll()
        Taro.reLaunch({
          url: `../login/index?_id=${id}&action=redirect`
        })
      } else {
        // console.log('touser: ', res.result.touser)
        await this.props.user.set({
          '_id': event.detail.value._id,
          'name': result.name,
          'touser': result.touser,
          'isVisitor': false,
          'isAdmin': event.detail.value._id === 'admin',
          'loginDate': new Date()
        })

        if(this.$router.params.action === 'redirect') {
          Taro.redirectTo({url: '../index/index'})
        } else {
          Taro.navigateBack({
            delta: 2
          })
        }
      }
    } catch (err) {
      Taro.hideLoading()
      this.onError(err)
    }
  }


  onError = err => {
    let msg
    if (typeof err.message === 'string') {
      if(err.message.includes('密码错误')) {
        msg = '密码错误'
      } else if (err.message.includes('document.get:fail document with _id')) {
        msg = '账号不存在'
      } else {
        msg = err.message || '出错'
      }
    }
    // console.log(err.message)

    Taro.showModal({
      title: '错误提示',
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
              value={this.$router.params._id || ''}
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
          <View class='button-zone'>
            <Button formType='submit'>
              {isChangePWD ? '修改密码' : '登录'}
            </Button>
          </View>
        </Form>
      </View>
    )
  }
}
