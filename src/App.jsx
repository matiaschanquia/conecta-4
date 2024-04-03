import { useState, useEffect, useRef } from "react";
import "./App.css";
import newTablero from "./utils/newTablero";

const amountTablero = {
	x: 7,
	y: 6
};

const App = () => {
	
	const [puntuaciones, setPuntuaciones] = useState({
		rojo: 0,
		amarillo: 0
	});
	const [turno, setTurno] = useState(0);

	const isMounted = useRef(false);

	const handleMouseOverItem = (e) => {
		const item = e.currentTarget;
		const column = item.getAttribute("data-column");
		const tableHtml = item.parentNode.parentNode.parentNode;

		const itemsColumn = tableHtml.querySelectorAll(`[data-column="${column}"]`);

		itemsColumn.forEach(itemColumn => {
			itemColumn.classList.add("hover");
		});
	};
	
	const handleMouseLeaveItem = (e) => {
		const item = e.currentTarget;
		const tableHtml = item.parentNode.parentNode.parentNode;
		
		const itemsColumn = tableHtml.querySelectorAll("td");

		itemsColumn.forEach(itemColumn => {
			itemColumn.classList.remove("hover");
		});
	};
	const [tableroConFichas, setTableroConFichas] = useState([ ...newTablero(amountTablero) ]);
	const [tableroDesactivado, setTableroDesactivado] = useState(false);

	const handleClickItem = (e) => {
		if(tableroDesactivado) {
			return;
		}
		const item = e.currentTarget;
		const column = parseInt(item.getAttribute("data-column"));
		if(tableroConFichas[tableroConFichas.length - 1][column] !== null) {
			alert("No se puede agregar más fichas en esa columna");
			return;
		}
		let fichasSeguidas = 0;
		for(let i = 0; i < amountTablero.y; i++) {
			if(tableroConFichas[i][column] === null) {
				const copyTablero = [...tableroConFichas];
				copyTablero[i][column] = turno;
				setTableroConFichas([ ...copyTablero ]);
				fichasSeguidas++;
				break;
			}

			if(turno === tableroConFichas[i][column]) {
				fichasSeguidas++;
			} else if(turno !== null) {
				fichasSeguidas = 0;
			}
		}

		if(fichasSeguidas >= 4) {
			setTimeout(() => {
				alert("¡Felicidades! Gano el " + ((turno === 0) ? "rojo" : "amarillo"));
			}, 10);
			setTableroDesactivado(true);
			setPuntuaciones({
				...puntuaciones,
				[turno === 0 ? "rojo" : "amarillo"]: puntuaciones[turno === 0 ? "rojo" : "amarillo"] + 1,
			});
			return;
		}

		if(turno === 0) {
			setTurno(1);
		} else {
			setTurno(0);
		}
	};

	const handleClickLimpiar = () => {
		setTableroDesactivado(false);
		setTableroConFichas([ ...newTablero(amountTablero) ]);
	};

	const handleClickReset = () => {
		localStorage.removeItem("puntuaciones");
		setPuntuaciones({
			rojo: 0,
			amarillo: 0
		});
	};

	useEffect(() => {
		const lsPuntuaciones = localStorage.getItem("puntuaciones");
		
		if(lsPuntuaciones) {
			const puntuacionesJson = JSON.parse(lsPuntuaciones);
			setPuntuaciones({ ...puntuacionesJson });
		}
	}, []);

	useEffect(() => {
		if(isMounted.current) {
			localStorage.setItem("puntuaciones", JSON.stringify(puntuaciones));
		} else {
			isMounted.current = true;
		}
	}, [puntuaciones]);

	return (
		<div className="app">
			<h1 className="titulo"><span>Cone</span><span>cta 4</span></h1>
			<h2 className="titulo-puntuacion">Puntuación</h2>
			<div className="contadores">
				<div className="contador rojo">
					<span className="circulo rojo"></span>
					<span className="number">{puntuaciones.rojo}</span>
				</div>
				<div className="contador amarillo">
					<span className="circulo amarillo"></span>
					<span className="number">{puntuaciones.amarillo}</span>
				</div>
			</div>
			{
				tableroDesactivado ? 
					<p className="mensaje">Limpie el tablero para jugar de nuevo</p> :
					<p className="mensaje">
						Turno del <span className={turno === 0 ? "rojo" : "amarillo"}>{turno === 0 ? "rojo" : "amarillo"}</span>. 
						Toca una columna
					</p>
			}
			<table border={1} className="tablero">
				<tbody>
					{
						[ ...newTablero(amountTablero) ].map((filas, indexI) => (
							<tr key={indexI}>
								{
									filas.map((_, indexJ) => (
										<td 
											key={indexJ}
											data-column={indexJ} 
											onMouseOver={handleMouseOverItem} 
											onMouseLeave={handleMouseLeaveItem}
											onClick={handleClickItem}
										>
											<span className={[...tableroConFichas].reverse()[indexI][indexJ] === null ? 
												"" : [...tableroConFichas].reverse()[indexI][indexJ] === 0 ?
													"rojo" : "amarillo" }></span>
										</td>
									))
								}
							</tr>
						))
					}
				</tbody>
			</table>
			<div className="buttons">
				<button onClick={handleClickLimpiar}>Limpiar tablero</button>
				<button onClick={handleClickReset}>Resetear puntuaciones</button>
			</div>

			<footer className="footer">
				<p>
					Matias Chanquia Dev
					<a href="https://matiaschanquiadev.com/" target="_blank" rel="noreferrer">
						<img src="/link.png" alt="Link a mi portafolio" />
					</a>
				</p>
			</footer>
		</div>
	);
};

export default App;
