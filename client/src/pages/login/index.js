import Taro, { Component } from '@tarojs/taro'
import { View, Form, Input, Button } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '登录'
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  login = event => {
    Taro.cloud.callFunction({
      name: "user",
      data: {
        type: 'login',
        data: event.detail.value
      }
    })
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  }

  render () {
    return (
      <View>
        <Form
          onSubmit={this.login}
        >
          <Input 
            name='_id'
            type='number'
            placeholder='工号'
          />
          <Input 
            name='pwd'
            password
            placeholder='密码'
          />
          <Button formType='submit'>
            登录
          </Button>
        </Form>
      </View>
    )
  }
}
