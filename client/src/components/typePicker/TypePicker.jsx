import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'

import classNames from 'classnames'

import './index.scss'

export default class TypePicker extends Component {
  static options = {
    addGlobalClass: true
  }
  
  constructor (props) {
    super(props)
    // selected
    this.state = {
      selected: ''
    }
  }

  onSearch = type => {
    // selected
    this.setState({selected: type})
    this.props.onSearch && this.props.onSearch('type', type)
  }

  render () {
    // 
    const { 
      typeList = []
    } = this.props
    
    return (
      <View
        className='type-picker type-picker-root'
      >
        <ScrollView
          scrollX
          className='type-list-root'
        >
          <View
            className='type-list-container'
          >
            {
              typeList.map(type => {
                
                let typeItemClass = classNames({
                  'type-item': true,
                  'type-item-selected': this.state.selected === type
                })

                return (
                  <View
                    className={typeItemClass}
                    key={type}
                    onClick={() => this.onSearch(type)}
                  >
                    {type}
                  </View>
                )
              })
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}