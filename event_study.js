// Event Study Visualizations - Minimalist Academic Style

const tooltip = d3.select('.tooltip');
const formatNumber = d3.format('.4f');
const formatDecimal = d3.format('.2f');

// ============================================================================
// 1. CARGAR DATOS Y POBLAR TABLA DE ESTADÍSTICAS
// ============================================================================

Promise.all([
    d3.json('data_did.json'),
    d3.json('data_event_study.json'),
    d3.json('data_event_coefficients.json')
]).then(([didData, eventData, coeffData]) => {

    // Poblar tabla de estadísticas descriptivas
    const statsBody = d3.select('#stats-body');

    statsBody.append('tr')
        .html(`
            <td>Pre-tratamiento (2012-2015)</td>
            <td>Tratados</td>
            <td class="number">${formatNumber(didData.pre_treatment.treated)}</td>
            <td class="number" rowspan="2">${formatNumber(didData.pre_treatment.diff)}</td>
        `);

    statsBody.append('tr')
        .html(`
            <td></td>
            <td>Control</td>
            <td class="number">${formatNumber(didData.pre_treatment.control)}</td>
        `);

    statsBody.append('tr')
        .html(`
            <td>Post-tratamiento (2016-2019)</td>
            <td>Tratados</td>
            <td class="number">${formatNumber(didData.post_treatment.treated)}</td>
            <td class="number" rowspan="2">${formatNumber(didData.post_treatment.diff)}</td>
        `);

    statsBody.append('tr')
        .html(`
            <td></td>
            <td>Control</td>
            <td class="number">${formatNumber(didData.post_treatment.control)}</td>
        `);

    statsBody.append('tr')
        .style('border-top', '2px solid #333')
        .html(`
            <td colspan="2"><strong>DiD Estimator</strong></td>
            <td colspan="2" class="number significant">${formatNumber(didData.did_estimator)}</td>
        `);

    // Resultado DiD
    d3.select('#did-result').html(`
        <strong>Estimador Difference-in-Differences:</strong><br><br>
        DiD = ${formatNumber(didData.did_estimator)}<br><br>
        <strong>Interpretación:</strong> ${didData.interpretation}<br><br>
        El estimador DiD de ${formatNumber(didData.did_estimator)} indica que, en promedio,
        las ventas en cantones afectados aumentaron ${formatNumber(Math.abs(didData.did_estimator))}
        puntos (en ln) más que en cantones control después del terremoto, controlando por
        diferencias pre-existentes entre grupos.
    `);

    // ========================================================================
    // 2. FIGURA 1: PARALLEL TRENDS
    // ========================================================================

    const margin = {top: 20, right: 120, bottom: 50, left: 60};
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg1 = d3.select('#parallel-trends')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Escalas
    const x1 = d3.scaleLinear()
        .domain([-4, 3])
        .range([0, width]);

    const allValues = eventData.flatMap(g => g.values.map(v => v.ln_ventas));
    const y1 = d3.scaleLinear()
        .domain([d3.min(allValues) - 0.1, d3.max(allValues) + 0.1])
        .range([height, 0]);

    // Grid
    svg1.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y1)
            .tickSize(-width)
            .tickFormat('')
        );

    // Línea vertical del evento
    svg1.append('line')
        .attr('class', 'event-line')
        .attr('x1', x1(0))
        .attr('x2', x1(0))
        .attr('y1', 0)
        .attr('y2', height);

    svg1.append('text')
        .attr('x', x1(0) + 5)
        .attr('y', 15)
        .style('font-size', '11px')
        .style('fill', '#d32f2f')
        .text('← Terremoto (Abril 2016)');

    // Líneas por grupo
    const line = d3.line()
        .x(d => x1(d.event_time))
        .y(d => y1(d.ln_ventas));

    const colors = {
        'Tratados (Afectados)': '#333',
        'Control (No Afectados)': '#999'
    };

    const lineWidths = {
        'Tratados (Afectados)': 3,
        'Control (No Afectados)': 2
    };

    eventData.forEach(group => {
        // Línea
        svg1.append('path')
            .datum(group.values)
            .attr('fill', 'none')
            .attr('stroke', colors[group.group])
            .attr('stroke-width', lineWidths[group.group])
            .attr('d', line);

        // Puntos
        svg1.selectAll(`.dots-${group.group.replace(/\s/g, '-')}`)
            .data(group.values)
            .enter()
            .append('circle')
            .attr('cx', d => x1(d.event_time))
            .attr('cy', d => y1(d.ln_ventas))
            .attr('r', 4)
            .attr('fill', colors[group.group])
            .attr('stroke', 'white')
            .attr('stroke-width', 1.5)
            .on('mouseover', function(event, d) {
                d3.select(this).attr('r', 6);
                tooltip.classed('show', true)
                    .html(`
                        <strong>${group.group}</strong><br>
                        Año: ${d.year}<br>
                        Tiempo evento: t=${d.event_time}<br>
                        ln(Ventas): ${formatNumber(d.ln_ventas)}
                    `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', 4);
                tooltip.classed('show', false);
            });
    });

    // Ejes
    svg1.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x1)
            .tickValues([-4, -3, -2, -1, 0, 1, 2, 3])
            .tickFormat(d => d === 0 ? 't=0' : `t=${d > 0 ? '+' : ''}${d}`)
        );

    svg1.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y1));

    // Labels
    svg1.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Años relativos al evento (t=0: 2016)');

    svg1.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('ln(Ventas) - Promedio por grupo');

    // Leyenda
    const legend1 = svg1.append('g')
        .attr('transform', `translate(${width + 15}, 20)`);

    eventData.forEach((group, i) => {
        const legendRow = legend1.append('g')
            .attr('transform', `translate(0, ${i * 25})`);

        legendRow.append('line')
            .attr('x1', 0)
            .attr('x2', 30)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke', colors[group.group])
            .attr('stroke-width', lineWidths[group.group]);

        legendRow.append('text')
            .attr('x', 35)
            .attr('y', 4)
            .style('font-size', '11px')
            .text(group.group);
    });

    // ========================================================================
    // 3. FIGURA 2: DiD VISUALIZATION
    // ========================================================================

    const svg2 = d3.select('#did-visualization')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Datos para visualización DiD
    const didVizData = [
        {period: 'Pre', treated: didData.pre_treatment.treated, control: didData.pre_treatment.control},
        {period: 'Post', treated: didData.post_treatment.treated, control: didData.post_treatment.control}
    ];

    const x2 = d3.scaleBand()
        .domain(['Pre', 'Post'])
        .range([100, width - 100])
        .padding(0.3);

    const allDidValues = [
        didData.pre_treatment.treated,
        didData.pre_treatment.control,
        didData.post_treatment.treated,
        didData.post_treatment.control
    ];

    const y2 = d3.scaleLinear()
        .domain([d3.min(allDidValues) - 0.1, d3.max(allDidValues) + 0.1])
        .range([height, 0]);

    // Grid
    svg2.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y2)
            .tickSize(-width)
            .tickFormat('')
        );

    // Líneas conectando períodos
    svg2.append('line')
        .attr('x1', x2('Pre') + x2.bandwidth() / 2)
        .attr('x2', x2('Post') + x2.bandwidth() / 2)
        .attr('y1', y2(didData.pre_treatment.treated))
        .attr('y2', y2(didData.post_treatment.treated))
        .attr('stroke', '#333')
        .attr('stroke-width', 3);

    svg2.append('line')
        .attr('x1', x2('Pre') + x2.bandwidth() / 2)
        .attr('x2', x2('Post') + x2.bandwidth() / 2)
        .attr('y1', y2(didData.pre_treatment.control))
        .attr('y2', y2(didData.post_treatment.control))
        .attr('stroke', '#999')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

    // Puntos
    didVizData.forEach(d => {
        // Tratados
        svg2.append('circle')
            .attr('cx', x2(d.period) + x2.bandwidth() / 2)
            .attr('cy', y2(d.treated))
            .attr('r', 6)
            .attr('fill', '#333')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .on('mouseover', function(event) {
                d3.select(this).attr('r', 8);
                tooltip.classed('show', true)
                    .html(`
                        <strong>Tratados - ${d.period === 'Pre' ? 'Pre' : 'Post'}-tratamiento</strong><br>
                        ln(Ventas): ${formatNumber(d.treated)}
                    `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', 6);
                tooltip.classed('show', false);
            });

        // Control
        svg2.append('circle')
            .attr('cx', x2(d.period) + x2.bandwidth() / 2)
            .attr('cy', y2(d.control))
            .attr('r', 6)
            .attr('fill', '#999')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .on('mouseover', function(event) {
                d3.select(this).attr('r', 8);
                tooltip.classed('show', true)
                    .html(`
                        <strong>Control - ${d.period === 'Pre' ? 'Pre' : 'Post'}-tratamiento</strong><br>
                        ln(Ventas): ${formatNumber(d.control)}
                    `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', 6);
                tooltip.classed('show', false);
            });
    });

    // Ejes
    svg2.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x2));

    svg2.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y2));

    // Labels
    svg2.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Período');

    svg2.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('ln(Ventas) - Promedio');

    // Leyenda
    const legend2 = svg2.append('g')
        .attr('transform', `translate(${width - 180}, 20)`);

    legend2.append('line')
        .attr('x1', 0)
        .attr('x2', 30)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', '#333')
        .attr('stroke-width', 3);

    legend2.append('text')
        .attr('x', 35)
        .attr('y', 4)
        .style('font-size', '11px')
        .text('Tratados');

    legend2.append('line')
        .attr('x1', 0)
        .attr('x2', 30)
        .attr('y1', 20)
        .attr('y2', 20)
        .attr('stroke', '#999')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

    legend2.append('text')
        .attr('x', 35)
        .attr('y', 24)
        .style('font-size', '11px')
        .text('Control');

    // ========================================================================
    // 4. FIGURA 3: EVENT STUDY COEFFICIENTS
    // ========================================================================

    const svg3 = d3.select('#event-study-plot')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Escalas
    const x3 = d3.scaleLinear()
        .domain([-4, 3])
        .range([0, width]);

    const coeffValues = coeffData.map(d => d.coefficient);
    const y3 = d3.scaleLinear()
        .domain([
            Math.min(d3.min(coeffValues) - 0.1, -0.1),
            Math.max(d3.max(coeffValues) + 0.1, 0.1)
        ])
        .range([height, 0]);

    // Grid
    svg3.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y3)
            .tickSize(-width)
            .tickFormat('')
        );

    // Línea de referencia en y=0
    svg3.append('line')
        .attr('class', 'reference-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y3(0))
        .attr('y2', y3(0));

    // Línea vertical del evento
    svg3.append('line')
        .attr('class', 'event-line')
        .attr('x1', x3(0))
        .attr('x2', x3(0))
        .attr('y1', 0)
        .attr('y2', height);

    svg3.append('text')
        .attr('x', x3(0) + 5)
        .attr('y', 15)
        .style('font-size', '11px')
        .style('fill', '#d32f2f')
        .text('← Terremoto');

    // Línea conectando coeficientes
    const coeffLine = d3.line()
        .x(d => x3(d.event_time))
        .y(d => y3(d.coefficient));

    svg3.append('path')
        .datum(coeffData)
        .attr('fill', 'none')
        .attr('stroke', '#333')
        .attr('stroke-width', 2)
        .attr('d', coeffLine);

    // Puntos con barras de error (simuladas)
    coeffData.forEach(d => {
        // Punto
        svg3.append('circle')
            .attr('cx', x3(d.event_time))
            .attr('cy', y3(d.coefficient))
            .attr('r', 5)
            .attr('fill', d.event_time < 0 ? '#666' : '#d32f2f')
            .attr('stroke', 'white')
            .attr('stroke-width', 1.5)
            .on('mouseover', function(event) {
                d3.select(this).attr('r', 7);
                tooltip.classed('show', true)
                    .html(`
                        <strong>t=${d.event_time} (${d.year})</strong><br>
                        Coeficiente: ${formatNumber(d.coefficient)}<br>
                        ${d.event_time < 0 ? 'Pre-tratamiento' : 'Post-tratamiento'}
                    `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', 5);
                tooltip.classed('show', false);
            });

        // Barras de error simuladas (±0.05)
        const errorBar = 0.05;
        svg3.append('line')
            .attr('x1', x3(d.event_time))
            .attr('x2', x3(d.event_time))
            .attr('y1', y3(d.coefficient - errorBar))
            .attr('y2', y3(d.coefficient + errorBar))
            .attr('stroke', '#666')
            .attr('stroke-width', 1.5);

        // Caps de las barras de error
        svg3.append('line')
            .attr('x1', x3(d.event_time) - 3)
            .attr('x2', x3(d.event_time) + 3)
            .attr('y1', y3(d.coefficient - errorBar))
            .attr('y2', y3(d.coefficient - errorBar))
            .attr('stroke', '#666')
            .attr('stroke-width', 1.5);

        svg3.append('line')
            .attr('x1', x3(d.event_time) - 3)
            .attr('x2', x3(d.event_time) + 3)
            .attr('y1', y3(d.coefficient + errorBar))
            .attr('y2', y3(d.coefficient + errorBar))
            .attr('stroke', '#666')
            .attr('stroke-width', 1.5);
    });

    // Ejes
    svg3.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x3)
            .tickValues([-4, -3, -2, -1, 0, 1, 2, 3])
            .tickFormat(d => d === 0 ? 't=0' : `t=${d > 0 ? '+' : ''}${d}`)
        );

    svg3.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y3));

    // Labels
    svg3.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Años relativos al evento (t=0: 2016)');

    svg3.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .text('Coeficiente Event Study (relativo a t=-1)');

    // Nota sobre el año base
    svg3.append('text')
        .attr('x', width / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-style', 'italic')
        .style('fill', '#666')
        .text('Año base: t=-1 (2015). Barras de error representan ±1 SE simulado.');

}).catch(error => {
    console.error('Error cargando datos:', error);
});

console.log('✓ Event Study visualizations loaded');
