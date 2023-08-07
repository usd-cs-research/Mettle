import React, { useState } from 'react';
import { sessionSocket } from '../../services/socket';
import { useParams } from 'react-router-dom';

export default function CalculationTable({ tableData, setTableData }) {
	const [guideMepopup, setGuideMePopup] = useState(false);
	const role = localStorage.getItem('role');
	const [AddDataPopup, setAddDataPopup] = useState(false);
	const { sessionId } = useParams();

	const [formData, setFormData] = useState({
		param: '',
		p_val: '',
		argument: '',
	});

	const handleGuideMe = () => {
		setGuideMePopup(true);

		sessionSocket.emit('forward', {
			eventDesc: 'calculation--showguidepopup',
			sessionId: sessionId,
		});
	};

	const handleAddData = () => {
		setAddDataPopup(true);

		sessionSocket.emit('forward', {
			eventDesc: 'calculation--showaddpopup',
			sessionId: sessionId,
		});
	};

	const handleClose = (event) => {
		const id = event.target.id;
		if (id === 'guideMeClose') {
			setGuideMePopup(false);
			sessionSocket.emit('forward', {
				eventDesc: 'calculation--hideguidepopup',
				sessionId: sessionId,
			});
		}
		if (id === 'addDataClose') {
			setAddDataPopup(false);
			sessionSocket.emit('forward', {
				eventDesc: 'calculation--hideaddpopup',
				sessionId: sessionId,
			});
		}
	};

	const addData = async (event) => {
		event.preventDefault();
		setTableData((prevTableData) => {
			return [...prevTableData, formData];
		});

		sessionSocket.emit('forward', {
			eventDesc: 'calculation--addData',
			sessionId: sessionId,
			data: [...tableData, formData],
		});

		setFormData({
			param: '',
			p_val: '',
			argument: '',
		});
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});

		sessionSocket.emit('forward', {
			eventDesc: 'calculation--handlechange',
			sessionId: sessionId,
			name: name,
			value: value,
		});
	};

	const handleRemoveData = (index) => {
		const updatedTableData = [...tableData];
		updatedTableData.splice(index, 1);
		setTableData(updatedTableData);

		sessionSocket.emit('forward', {
			eventDesc: 'calculation--handleRemove',
			sessionId: sessionId,
			data: updatedTableData,
		});
	};

	sessionSocket.on('forward', (data) => {
		if (data.eventDesc === 'calculation--showguidepopup') {
			setGuideMePopup(true);
		}

		if (data.eventDesc === 'calculation--showaddpopup') {
			setAddDataPopup(true);
		}

		if (data.eventDesc === 'calculation--hideguidepopup') {
			setGuideMePopup(false);
		}

		if (data.eventDesc === 'calculation--hideaddpopup') {
			setAddDataPopup(false);
		}

		if (data.eventDesc === 'calculation--addData') {
			setTableData(data.data);

			setFormData({
				param: '',
				p_val: '',
				argument: '',
			});
		}

		if (data.eventDesc === 'calculation--handlechange') {
			setFormData({
				...formData,
				[data.name]: data.value,
			});
		}

		if (data.eventDesc === 'calculation--handleRemove') {
			setTableData(data.data);
		}
	});

	return (
		<div style={{ width: '550px', borderStyle: 'groove' }}>
			The equation for electric power you wrote was
			<div
				class="subtask_text"
				className="medium_margin subtask_text txt_left"
			>
				<div
					id="pre_txt"
					class="medium_margin rcorners txt_left"
					style={{ height: '50px' }}
				></div>
				<div class="medium_margin subtask_text txt_left">
					Identify reasonable values for the parameters in your
					equation and enter them in the table below.
					<button
						type="button"
						className="btn btn-info"
						disabled={role === 'Navigator'}
						style={{ margin: '0px 10px' }}
						onClick={handleAddData}
					>
						Add Data
					</button>
					<button
						className="btn btn-primary"
						id="problem1calc_guide"
						type="button"
						disabled={role === 'Navigator'}
						onClick={handleGuideMe}
					>
						Guide Me
					</button>
				</div>
				<div>
					<table className="table" id="data_table">
						<thead>
							<tr>
								<th>Parameter</th>
								<th>Value</th>
								<th>Justification for value</th>
								<th>remove</th>
							</tr>
						</thead>
						<tbody>
							{tableData.length > 0 ? (
								tableData.map((data, index) => (
									<tr key={index}>
										<td>{data.param}</td>
										<td>{data.p_val}</td>
										<td>{data.argument}</td>
										<td>
											<button
												onClick={() =>
													handleRemoveData(index)
												}
												disabled={role === 'Navigator'}
												className="btn btn-danger btn-sm"
											>
												Remove
											</button>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="4">No data available</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
			{guideMepopup && (
				<>
					<div className="main--overlay"></div>
					<div className="sub--overlay">
						<span
							className="close"
							id="guideMeClose"
							disabled={role === 'Navigator'}
							onClick={handleClose}
						>
							&times;
						</span>
						<span className="popuptext" id="problem1calc_prompts">
							1) What should this parameter value be according to
							the problem specifications? <br />
							<br />
							2) If this parameter is not specified in the
							problem, what are the highest and lowest values of
							this parameter that you can think of? Is the value
							that you have chosen in between these two extremes?
							<br />
							<br />
							3) Compare your chosen value with some other value
							for this parameter that you know for sure. For
							example, compare length with the length of a scale.
							Or mass with a mass of 1Kg. <br />
							<br />
							4) See the simulator for efficiency of motors and
							information page for drag coefficients. Identify
							which of these values is most applicable in the
							given problem.
							<br />
							<br />
						</span>
					</div>
				</>
			)}
			{AddDataPopup && (
				<>
					<div className="main--overlay"></div>
					<div className="sub--overlay">
						<span
							className="close"
							disabled={role === 'Navigator'}
							id="addDataClose"
							onClick={handleClose}
						>
							&times;
						</span>
						<div className="modal-header">
							<h4
								className="modal-title"
								style={{ margin: '10px 10px' }}
							>
								Enter reasonable values for the parameters
							</h4>
						</div>
						<div className="modal-body" style={{ padding: '10px' }}>
							<form onSubmit={addData}>
								<label className="validateTips"></label>
								<label
									for="param"
									style={{ margin: '10px 5px' }}
								>
									Parameter
								</label>
								<input
									type="text"
									name="param"
									id="param"
									required
									style={{ margin: '10px 5px' }}
									className="text ui-widget-content ui-corner-all"
									disabled={role === 'Navigator'}
									value={formData.param}
									onChange={handleChange}
								/>
								<br />
								<label
									for="p_val"
									style={{ margin: '10px 5px' }}
								>
									Value
								</label>
								<input
									type="text"
									name="p_val"
									style={{ margin: '10px 5px' }}
									id="p_val"
									disabled={role === 'Navigator'}
									required
									className="text ui-widget-content ui-corner-all"
									value={formData.p_val}
									onChange={handleChange}
								/>
								<br />
								<label
									for="argument"
									style={{ margin: '10px 5px' }}
								>
									Justification for value
								</label>
								<input
									type="text"
									style={{ margin: '10px 5px' }}
									name="argument"
									id="argument"
									className="text ui-widget-content ui-corner-all"
									required
									value={formData.argument}
									disabled={role === 'Navigator'}
									onChange={handleChange}
								/>
								<br />
								<input
									type="submit"
									disabled={role === 'Navigator'}
									id="add_submit"
									className="btn btn-success"
									value="Add"
								/>
							</form>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
