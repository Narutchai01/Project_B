import '../pages/account.css'

const TableAcc = ({score}) => {
    return (
        <>
            {score.map((item, index) => (
                <tr key={index} className='accountrow'>
                    <td>{index + 1}</td>
                    <td>{item.username}</td>
                    <td>{item.score}</td>
                    <td className="noright">{item.date}</td>
                </tr>
            )
            )}
        </>
    )
}

export default TableAcc
