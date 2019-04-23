import Taro, { Component } from '@tarojs/taro'
import { View, Input, Picker } from '@tarojs/components'

const searchFieldList = [
  {
    key: '书名',
    value: 'title',
  },
  {
    key: '作者',
    value: 'author'
  },
]

export default class Search extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchField: searchFieldList[0],
      searchInfo: '',
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  selectSearchField = event => {
    this.setState({
      searchField: searchFieldList[event.detail.value]
    })
  }

  search = () => {
    Taro.cloud.callFunction({
      name: "book",
      data: {
        type: 'search',
        data: {
          searchField: this.state.searchField.value,
          searchInfo: this.state.searchInfo,
          skip: 0,
          limit: 10
        }
      }
    })
    .then(res => {
      this.props.onSuccess && this.props.onSuccess(res.result.data)
    })
    .catch(err => {
      this.props.onError && this.props.onError(err)
    })
  }

  catchInput = event => {
    this.setState({
      searchInfo: event.detail.value
    })
  }

  render () {
    return (
      <View>
        <Picker
          mode='selector'
          onChange={this.selectSearchField}
          range={searchFieldList}
          rangeKey='key'
        >
          <View>
            {this.state.searchField.key}
          </View>
        </Picker>
        <Input 
          value={this.state.searchInfo}
          confirmType='search'
          onInput={this.catchInput}
          onConfirm={this.search}
        />
      </View>
    )
  }
}
