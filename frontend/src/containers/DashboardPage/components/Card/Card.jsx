import React from 'react'

import styles from './style.scss'
import CardTitle from '@components/CardTitle.jsx'

import useTotal from '@hooks/useTotal.js'


const Card = () => {
  const total = useTotal()
  return (
    <div className={styles.card}>
      <CardTitle title={'Total Deposits'}></CardTitle>
      {total}
    </div>
  )
}

export default Card
