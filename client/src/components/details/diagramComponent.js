import React, { useEffect, useRef } from 'react';
import SVG from 'svg.js';

const DiagramComponent = () => {
	const svgRef = useRef(null);

	useEffect(() => {
		const draw = SVG(svgRef.current)
			.size(560, 560)
			.viewbox(-20, -20, 540, 540);

		const handleClick = (elementId) => {
			const element = draw.get(elementId);
			if (element) {
				element.show();
			}
		};

		const handleDoubleClick = (elementId) => {
			const element = draw.get(elementId);
			if (element) {
				element.hide();
			}
		};

		const rect = draw.rect(500, 500).fill('#bdbdbd');

		const funcPolygon = draw
			.polygon('0,250 0,500 250,500')
			.addClass('task_map');
		const funcText = draw
			.text('Functional Modeling')
			.move(5, 430)
			.addClass('task_text');
		const funcText1 = draw
			.text('What does the heart need to do?')
			.move(25, 450)
			.addClass('task_text_eg');
		const funcText2 = draw
			.text('that requires power?')
			.move(25, 470)
			.addClass('task_text_eg');

		const qualPolygon = draw
			.polygon('0,0 0,250 250,500 500,500')
			.addClass('task_map');
		const qualText = draw
			.text('Qualitative Modeling')
			.move(30, 210)
			.addClass('task_text');
		const qualText1 = draw
			.text('What are the dominant parameters')
			.move(40, 230)
			.addClass('task_text_eg');
		const qualText2 = draw
			.text('that affect power?')
			.move(40, 250)
			.addClass('task_text_eg');

		const quantPolygon = draw
			.polygon('250,0 250,250 500,500 500,250')
			.addClass('task_map');
		const quantText = draw
			.text('Quantitative Modeling')
			.move(260, 210)
			.addClass('task_text');
		const quantText1 = draw
			.text('What is the equation connecting')
			.move(260, 230)
			.addClass('task_text_eg');
		const quantText2 = draw
			.text('power required to the dominant parameters?')
			.move(280, 250)
			.addClass('task_text_eg');

		const calcPolygon = draw
			.polygon('0,0 250,250 250,0')
			.addClass('task_map');
		const calcText = draw
			.text('Calculation')
			.move(100, 30)
			.addClass('task_text');
		const calcText1 = draw
			.text('Substituting reasonable values in the equation,')
			.move(65, 50)
			.addClass('task_text_eg');
		const calcText2 = draw
			.text('what is the estimate of power?')
			.move(65, 70)
			.addClass('task_text_eg');

		const funcGroup = draw.group();
		funcGroup.add(funcPolygon);
		funcGroup.add(funcText);
		funcGroup.add(funcText1);
		funcGroup.add(funcText2);

		const qualGroup = draw.group();
		qualGroup.add(qualPolygon);
		qualGroup.add(qualText);
		qualGroup.add(qualText1);
		qualGroup.add(qualText2);

		const quantGroup = draw.group();
		quantGroup.add(quantPolygon);
		quantGroup.add(quantText);
		quantGroup.add(quantText1);
		quantGroup.add(quantText2);

		const calcGroup = draw.group();
		calcGroup.add(calcPolygon);
		calcGroup.add(calcText);
		calcGroup.add(calcText1);
		calcGroup.add(calcText2);

		funcGroup
			.on('click', () => handleClick('funcGroup'))
			.on('dblclick', () => handleDoubleClick('funcGroup'));
		qualGroup
			.on('click', () => handleClick('qualGroup'))
			.on('dblclick', () => handleDoubleClick('qualGroup'));
		quantGroup
			.on('click', () => handleClick('quantGroup'))
			.on('dblclick', () => handleDoubleClick('quantGroup'));
		calcGroup
			.on('click', () => handleClick('calcGroup'))
			.on('dblclick', () => handleDoubleClick('calcGroup'));

		return () => {
			draw.clear();
		};
	}, []);

	return (
		<div className="col-lg-6">
			<svg ref={svgRef} />
		</div>
	);
};

export default DiagramComponent;
