import * as THREE from 'three'

const Flag = ({ size, rotation }) => {
  return (
      <mesh scale={[size, size, size]} rotation={[0, 0, rotation]}>
        <mesh rotation={[1.57, 0, 0]} position={[0, 0, 0.2]} >
          <cylinderGeometry attach='geometry' args={[0.02, 0.02, 0.4]} />
          <meshLambertMaterial attach='material' color={'#737373'} />
        </mesh>
        <mesh position={[0.1, 0.045, 0.34]} rotation={[0, 0, 0.4]} >
          <boxGeometry attach='geometry' args={[0.2, 0.01, 0.1]} />
          <meshStandardMaterial attach='material' color='orange' />
        </mesh>
      </mesh>
  )
}

export default Flag
