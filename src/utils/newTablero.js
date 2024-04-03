function newTablero(amountTablero) {
	return Array.from({ length: amountTablero.y }, () => Array(amountTablero.x).fill(null));
}

export default newTablero;