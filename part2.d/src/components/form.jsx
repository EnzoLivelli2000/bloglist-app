function Form({addName,newName,newPhone,handleKeyName,handleKeyPhone}) {
    return (
        <form onSubmit={addName}>
            <div>
                name: <input value={newName} onChange={handleKeyName} />
            </div>
            <div>
                number: <input value={newPhone} onChange={handleKeyPhone} />
            </div>
            <div>
                <button type='submit'>add</button>
            </div>
        </form>)
}

export default Form