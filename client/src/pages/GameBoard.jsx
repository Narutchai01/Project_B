import { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, RoundedBox, Text } from '@react-three/drei'
import { a } from '@react-spring/three'

import MineCube from '../components/MineCube'
import { init } from '../util/Init'


class GameFunc {
  constructor(setFlagText, startTimer, stopTimer, setIconText) {
    this.setFlagText = setFlagText
    this.startTimer = startTimer
    this.stopTimer = stopTimer
    this.setIconText = setIconText
  }
}

const GameBoard = ({ size, mineNum, setAppState }) => {
  const dict = init(size, mineNum)

  //const flagElem = document.querySelector('.flag')
  //const timeElem = document.querySelector('.time')

  const setFlagText = (num) => {
    //if (num < 100) num = '0' + num
    //if (num < 10) num = '00' + num
    //flagElem.innerHTML = num
  }

  //let secondsOfTime = 0
  //let interval = null
  const timer = () => {
    //secondsOfTime++

    //let minutes = Math.floor(secondsOfTime / 60)
    //let seconds = secondsOfTime % 60
    //if (minutes < 10) minutes = '0' + minutes
    //if (seconds < 10) seconds = '0' + seconds

    //timeElem.innerHTML = minutes + ':' + seconds
  }
  const startTimer = () => {
    //interval = setInterval(timer, 1000)
  }
  const stopTimer = () => {
    //clearInterval(interval)
    //interval = null
  }


  let GameFunction = new GameFunc(setFlagText, startTimer, stopTimer)

  return (
    <>
      <Canvas>
        <ambientLight intensity={0.4} color={'blue'} />
        <ambientLight intensity={0.6} color={'white'} />
        <pointLight intensity={20} color={'lightblue'} position={[size * 2, size * 2, size]} />
        <pointLight intensity={20} color={'purple'} position={[-size * 2, -size, -size * 2]} />
        <OrbitControls enablePan={false} minDistance={size} maxDistance={size * 2} />
        <MineCube size={size} dict={dict} mineNum={mineNum} GameFunc={GameFunction} setAppState={setAppState} />
      </Canvas>
    </>
  )
}

export default GameBoard
