import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import './LandingPage.css'
import classNames from 'classnames'

import LoginPage from './LoginPage'
import SignUpPage from './SignUpPage'


const MenuCube = ({ onClickLogin, onClickSignUp }) => {
  const [loginHover, setLoginHover] = useState(false)
  const [signUpHover, setSignUpHover] = useState(false)
  const [focus, setFocus] = useState('')

  const cubeRef = useRef()
  useFrame((state, delta) => {
    if (focus == '' && !(cubeRef.current.rotation.y >= -0.005 && cubeRef.current.rotation.y <= 0.005)) 
        cubeRef.current.rotation.y -= Math.sign(cubeRef.current.rotation.y) * 0.015
    if (focus == 'login' && cubeRef.current.rotation.y >= -0.3)
      cubeRef.current.rotation.y -= 0.015
    if (focus == 'signup' && cubeRef.current.rotation.y <= 0.3)
      cubeRef.current.rotation.y += 0.015
  })

  const onClickFocus = (btnName) => {
    if (btnName == focus) setFocus('')
    else setFocus(btnName)
  }

  return (
    <mesh rotation={[0.25, -0.785, 0]}>
      <ambientLight intensity={0.2} color='blue' />
      <ambientLight intensity={0.2} color='white' />
      <pointLight intensity={8} color='lightblue' position={[1.8, 3, 2]} />
      <pointLight intensity={6} color='purple' position={[2, -3, 1.8]} />
      <mesh ref={cubeRef}>
        <boxGeometry attach={'geometry'} args={[2, 2, 2]} />
        <meshStandardMaterial attach={'material'} color={'white'} />
        <Text onClick={() => {onClickLogin(); onClickFocus('login')}} 
              color={loginHover ? 'rgb(9, 4, 15)' : 'white'} 
              position={[0, 0, 1.01]} scale={[0.5, 0.5, 0.5]} 
              onPointerEnter={() => { setLoginHover(true) }} 
              onPointerLeave={() => { setLoginHover(false) }}>
          Login
        </Text>
        <Text onClick={() => {onClickSignUp(); onClickFocus('signup')}} 
              color={signUpHover ? 'rgb(9, 4, 15)' : 'white'} 
              position={[1.01, 0, 0]} scale={[0.5, 0.5, 0.5]} 
              rotation={[0, 1.57, 0]} onPointerEnter={() => { setSignUpHover(true) }} 
              onPointerLeave={() => { setSignUpHover(false) }}>
          Sign Up
        </Text>
      </mesh>
    </mesh>
  )
}


const LandingPage = () => {
  const [firstClick, setFirstClick] = useState(false)
  const [loginPage, setLoginPage] = useState(false)
  const loginClass = classNames({'expand-container' : loginPage, 
    'collapse-container' : !loginPage, 'disable' : !firstClick})
  const loginFormClass = classNames('login-form', {'login-in' : loginPage, 'login-out' : !loginPage})

  const onClickLogin = () => {
    if (!firstClick) setFirstClick(true)
    if (signUpPage == true) setSignUpPage(false)
    if (loginPage == false) setLoginPage(true)
    else setLoginPage(false)
  }

  const [signUpPage, setSignUpPage] = useState(false)
  const signUpClass = classNames({'expand-container' : signUpPage, 'collapse-container' : !signUpPage, 'disable' : !firstClick})
  const signUpFormClass = classNames('sign-up-form', {'sign-up-in' : signUpPage, 'sign-up-out' : !signUpPage})

  const onClickSignUp = () => {
    if (!firstClick) setFirstClick(true)
    if (loginPage == true) setLoginPage(false)
    if (signUpPage == false) setSignUpPage(true)
    else setSignUpPage(false)
  }
  
  
  return (
    <>
      <div className='landingpage-main-container'>
        <div className={signUpClass}>
          <div className={signUpFormClass}>
            <SignUpPage setLoginPage={setLoginPage} setSignUpPage={setSignUpPage}/>
          </div>
        </div>
        <div className='canvas'>
          <Canvas>
            <MenuCube onClickLogin={onClickLogin} onClickSignUp={onClickSignUp}/>
          </Canvas>
        </div>
        <div className={loginClass}>
          <div className={loginFormClass}>
            <LoginPage />
          </div>
        </div>
      </div>
    </>
  )
}

export default LandingPage
