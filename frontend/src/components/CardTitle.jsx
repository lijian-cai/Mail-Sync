import React, { Component } from 'react'

import styles from './card-title.scss'

export class CardTitle extends Component {
  render() {
    return (
      <h3 className={styles.card_title}>{this.props.title}</h3>
    )
  }
}

export default CardTitle
