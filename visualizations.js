// Navegación entre secciones
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Remover active de todos
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

        // Activar el seleccionado
        tab.classList.add('active');
        const sectionId = tab.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// Tooltip global
const tooltip = d3.select('.tooltip');

// Colores
const colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#4ade80',
    danger: '#f87171',
    warning: '#fbbf24',
    info: '#60a5fa',
    sectores: d3.schemeSet3
};

// Función para formatear números
const formatNumber = d3.format(',.0f');
const formatDecimal = d3.format('.2f');
const formatPercent = d3.format('.2%');

// ============================================================================
// 1. GRÁFICO DE CRECIMIENTO DE VENTAS
// ============================================================================
Promise.all([
    d3.json('data_ventas.json')
]).then(([ventasData]) => {
    // Crecimiento por cantón
    const margin = {top: 40, right: 30, bottom: 120, left: 60};
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#chart-ventas-crecimiento')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .domain(ventasData.map(d => d.canton))
        .padding(0.2);

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([
            d3.min(ventasData, d => d.crecimiento) - 5,
            d3.max(ventasData, d => d.crecimiento) + 5
        ]);

    // Grid
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat('')
        );

    // Ejes
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y));

    // Línea en y=0
    svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(0))
        .attr('y2', y(0))
        .attr('stroke', '#333')
        .attr('stroke-width', 2);

    // Barras
    svg.selectAll('.bar')
        .data(ventasData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.canton))
        .attr('y', d => d.crecimiento > 0 ? y(d.crecimiento) : y(0))
        .attr('width', x.bandwidth())
        .attr('height', d => Math.abs(y(d.crecimiento) - y(0)))
        .attr('fill', d => d.crecimiento > 0 ? colors.success : colors.danger)
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 1);
            tooltip.classed('show', true)
                .html(`
                    <strong>${d.canton}</strong><br>
                    Crecimiento: <strong>${formatDecimal(d.crecimiento)}%</strong> anual
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 0.8);
            tooltip.classed('show', false);
        });

    // Labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text('Tasa de Crecimiento Promedio Anual (%)');

    // ========================================================================
    // 2. EVOLUCIÓN TEMPORAL DE VENTAS (TOP 10)
    // ========================================================================
    const top10 = ventasData.slice(0, 10);

    const margin2 = {top: 40, right: 150, bottom: 60, left: 60};
    const width2 = 900 - margin2.left - margin2.right;
    const height2 = 500 - margin2.top - margin2.bottom;

    const svg2 = d3.select('#chart-ventas-evolucion')
        .append('svg')
        .attr('width', width2 + margin2.left + margin2.right)
        .attr('height', height2 + margin2.top + margin2.bottom)
        .append('g')
        .attr('transform', `translate(${margin2.left},${margin2.top})`);

    const years = top10[0].values.map(v => v.year);

    const x2 = d3.scaleLinear()
        .range([0, width2])
        .domain([2012, 2019]);

    const allValues = top10.flatMap(d => d.values.map(v => v.ln_ventas));
    const y2 = d3.scaleLinear()
        .range([height2, 0])
        .domain([d3.min(allValues) - 0.5, d3.max(allValues) + 0.5]);

    const colorScale = d3.scaleOrdinal()
        .domain(top10.map(d => d.canton))
        .range(d3.schemeCategory10);

    // Grid
    svg2.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y2)
            .tickSize(-width2)
            .tickFormat('')
        );

    // Ejes
    svg2.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height2})`)
        .call(d3.axisBottom(x2).tickFormat(d3.format('d')));

    svg2.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y2));

    // Líneas
    const line = d3.line()
        .x(d => x2(d.year))
        .y(d => y2(d.ln_ventas));

    top10.forEach(canton => {
        svg2.append('path')
            .datum(canton.values)
            .attr('fill', 'none')
            .attr('stroke', colorScale(canton.canton))
            .attr('stroke-width', 3)
            .attr('d', line);

        // Puntos
        svg2.selectAll(`.dot-${canton.canton.replace(/\s/g, '-')}`)
            .data(canton.values)
            .enter()
            .append('circle')
            .attr('cx', d => x2(d.year))
            .attr('cy', d => y2(d.ln_ventas))
            .attr('r', 5)
            .attr('fill', colorScale(canton.canton))
            .on('mouseover', function(event, d) {
                d3.select(this).attr('r', 8);
                tooltip.classed('show', true)
                    .html(`
                        <strong>${canton.canton}</strong><br>
                        Año: ${d.year}<br>
                        ln(Ventas): ${formatDecimal(d.ln_ventas)}<br>
                        Ventas: $${formatNumber(d.ventas)}
                    `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', 5);
                tooltip.classed('show', false);
            });
    });

    // Leyenda
    const legend = svg2.append('g')
        .attr('transform', `translate(${width2 + 20}, 0)`);

    top10.forEach((canton, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 25})`);

        legendRow.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', colorScale(canton.canton));

        legendRow.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('font-size', '12px')
            .text(canton.canton);
    });

    // Labels
    svg2.append('text')
        .attr('x', width2 / 2)
        .attr('y', height2 + 50)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Año');

    svg2.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height2 / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('ln(Ventas)');
});

// ============================================================================
// 3. GRÁFICO DE PIB TOTAL
// ============================================================================
d3.json('data_pib.json').then(pibData => {
    const margin = {top: 40, right: 30, bottom: 60, left: 80};
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#chart-pib-total')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .range([0, width])
        .domain([0, pibData.length - 1]);

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([
            d3.min(pibData, d => d.pib) * 0.95,
            d3.max(pibData, d => d.pib) * 1.05
        ]);

    // Grid
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat('')
        );

    // Área
    const area = d3.area()
        .x((d, i) => x(i))
        .y0(height)
        .y1(d => y(d.pib));

    svg.append('path')
        .datum(pibData)
        .attr('fill', colors.primary)
        .attr('fill-opacity', 0.3)
        .attr('d', area);

    // Línea
    const line = d3.line()
        .x((d, i) => x(i))
        .y(d => y(d.pib));

    svg.append('path')
        .datum(pibData)
        .attr('fill', 'none')
        .attr('stroke', colors.primary)
        .attr('stroke-width', 3)
        .attr('d', line);

    // Puntos
    svg.selectAll('.dot')
        .data(pibData)
        .enter()
        .append('circle')
        .attr('cx', (d, i) => x(i))
        .attr('cy', d => y(d.pib))
        .attr('r', 4)
        .attr('fill', colors.primary)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('r', 7);
            tooltip.classed('show', true)
                .html(`
                    <strong>${d.periodo}</strong><br>
                    PIB: <strong>$${formatNumber(d.pib / 1000000)}M</strong>
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).attr('r', 4);
            tooltip.classed('show', false);
        });

    // Ejes
    const years = [...new Set(pibData.map(d => d.año))];
    const yearIndices = years.map(year =>
        pibData.findIndex(d => d.año === year && d.trimestre === 'I')
    ).filter(idx => idx !== -1);

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .tickValues(yearIndices)
            .tickFormat((d, i) => years[i])
        );

    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y)
            .tickFormat(d => `$${d / 1000000}M`)
        );

    // Labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Período (Trimestral)');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -60)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('PIB (Millones USD)');

    // ========================================================================
    // 4. EVOLUCIÓN DE SECTORES
    // ========================================================================
    const margin2 = {top: 40, right: 150, bottom: 60, left: 80};
    const width2 = 900 - margin2.left - margin2.right;
    const height2 = 500 - margin2.top - margin2.bottom;

    const svg2 = d3.select('#chart-sectores-evolucion')
        .append('svg')
        .attr('width', width2 + margin2.left + margin2.right)
        .attr('height', height2 + margin2.top + margin2.bottom)
        .append('g')
        .attr('transform', `translate(${margin2.left},${margin2.top})`);

    const sectores = ['Comercio', 'Manufactura', 'Agricultura', 'Construcción'];
    const colorScale2 = d3.scaleOrdinal()
        .domain(sectores)
        .range(['#667eea', '#f093fb', '#4ade80', '#fbbf24']);

    const x2 = d3.scaleLinear()
        .range([0, width2])
        .domain([0, pibData.length - 1]);

    const allSectorValues = pibData.flatMap(d =>
        sectores.map(s => d.sectores[s])
    );

    const y2 = d3.scaleLinear()
        .range([height2, 0])
        .domain([
            d3.min(allSectorValues) * 0.95,
            d3.max(allSectorValues) * 1.05
        ]);

    // Grid
    svg2.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y2)
            .tickSize(-width2)
            .tickFormat('')
        );

    // Líneas por sector
    sectores.forEach(sector => {
        const line = d3.line()
            .x((d, i) => x2(i))
            .y(d => y2(d.sectores[sector]));

        svg2.append('path')
            .datum(pibData)
            .attr('fill', 'none')
            .attr('stroke', colorScale2(sector))
            .attr('stroke-width', 3)
            .attr('d', line);
    });

    // Ejes
    svg2.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height2})`)
        .call(d3.axisBottom(x2)
            .tickValues(yearIndices)
            .tickFormat((d, i) => years[i])
        );

    svg2.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y2)
            .tickFormat(d => `$${d / 1000}K`)
        );

    // Leyenda
    const legend2 = svg2.append('g')
        .attr('transform', `translate(${width2 + 20}, 0)`);

    sectores.forEach((sector, i) => {
        const legendRow = legend2.append('g')
            .attr('transform', `translate(0, ${i * 30})`);

        legendRow.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', colorScale2(sector));

        legendRow.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('font-size', '13px')
            .text(sector);
    });

    // Labels
    svg2.append('text')
        .attr('x', width2 / 2)
        .attr('y', height2 + 50)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Período (Trimestral)');

    svg2.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height2 / 2)
        .attr('y', -60)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Valor del Sector (Miles USD)');
});

// ============================================================================
// 5. PARTICIPACIÓN Y CORRELACIÓN DE SECTORES
// ============================================================================
d3.json('data_sectores.json').then(sectoresData => {
    // Participación
    const margin = {top: 40, right: 30, bottom: 80, left: 60};
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#chart-sectores-participacion')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .domain(sectoresData.map(d => d.sector))
        .padding(0.2);

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(sectoresData, d => d.participacion) * 1.1]);

    const colorScale = d3.scaleOrdinal()
        .domain(sectoresData.map(d => d.sector))
        .range(colors.sectores);

    // Grid
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat('')
        );

    // Barras
    svg.selectAll('.bar')
        .data(sectoresData)
        .enter()
        .append('rect')
        .attr('x', d => x(d.sector))
        .attr('y', d => y(d.participacion))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.participacion))
        .attr('fill', d => colorScale(d.sector))
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 1);
            tooltip.classed('show', true)
                .html(`
                    <strong>${d.sector}</strong><br>
                    Participación: <strong>${formatDecimal(d.participacion)}%</strong><br>
                    Correlación: <strong>${formatDecimal(d.correlacion)}</strong>
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 0.8);
            tooltip.classed('show', false);
        });

    // Etiquetas de valores
    svg.selectAll('.label')
        .data(sectoresData)
        .enter()
        .append('text')
        .attr('x', d => x(d.sector) + x.bandwidth() / 2)
        .attr('y', d => y(d.participacion) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(d => `${formatDecimal(d.participacion)}%`);

    // Ejes
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y).tickFormat(d => `${d}%`));

    // ========================================================================
    // 6. CORRELACIÓN CON PIB
    // ========================================================================
    const margin2 = {top: 40, right: 30, bottom: 60, left: 120};
    const width2 = 900 - margin2.left - margin2.right;
    const height2 = 500 - margin2.top - margin2.bottom;

    const svg2 = d3.select('#chart-sectores-correlacion')
        .append('svg')
        .attr('width', width2 + margin2.left + margin2.right)
        .attr('height', height2 + margin2.top + margin2.bottom)
        .append('g')
        .attr('transform', `translate(${margin2.left},${margin2.top})`);

    const sortedByCorr = [...sectoresData].sort((a, b) => b.correlacion - a.correlacion);

    const x2 = d3.scaleLinear()
        .range([0, width2])
        .domain([0, 1]);

    const y2 = d3.scaleBand()
        .range([0, height2])
        .domain(sortedByCorr.map(d => d.sector))
        .padding(0.2);

    // Barras horizontales
    svg2.selectAll('.bar')
        .data(sortedByCorr)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', d => y2(d.sector))
        .attr('width', d => x2(d.correlacion))
        .attr('height', y2.bandwidth())
        .attr('fill', d => colorScale(d.sector))
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 1);
            tooltip.classed('show', true)
                .html(`
                    <strong>${d.sector}</strong><br>
                    Correlación con PIB: <strong>${formatDecimal(d.correlacion)}</strong>
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 0.8);
            tooltip.classed('show', false);
        });

    // Etiquetas de valores
    svg2.selectAll('.label')
        .data(sortedByCorr)
        .enter()
        .append('text')
        .attr('x', d => x2(d.correlacion) + 5)
        .attr('y', d => y2(d.sector) + y2.bandwidth() / 2 + 5)
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(d => formatDecimal(d.correlacion));

    // Ejes
    svg2.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y2));

    svg2.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height2})`)
        .call(d3.axisBottom(x2));
});

// ============================================================================
// 7. IMPACTO DEL TERREMOTO
// ============================================================================
d3.json('data_impacto.json').then(impactoData => {
    // Comparación pre/post
    const margin = {top: 40, right: 30, bottom: 100, left: 60};
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#chart-terremoto-comparacion')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x0 = d3.scaleBand()
        .range([0, width])
        .domain(impactoData.map(d => d.canton))
        .padding(0.2);

    const x1 = d3.scaleBand()
        .domain(['pre', 'post'])
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([
            d3.min(impactoData, d => Math.min(d.cambio_pre_terremoto, d.cambio_post_terremoto)) - 0.2,
            d3.max(impactoData, d => Math.max(d.cambio_pre_terremoto, d.cambio_post_terremoto)) + 0.2
        ]);

    // Grid
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat('')
        );

    // Línea en y=0
    svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(0))
        .attr('y2', y(0))
        .attr('stroke', '#333')
        .attr('stroke-width', 2);

    // Grupos de barras
    const grupos = svg.selectAll('.grupo')
        .data(impactoData)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${x0(d.canton)},0)`);

    // Barra pre-terremoto
    grupos.append('rect')
        .attr('x', x1('pre'))
        .attr('y', d => d.cambio_pre_terremoto > 0 ? y(d.cambio_pre_terremoto) : y(0))
        .attr('width', x1.bandwidth())
        .attr('height', d => Math.abs(y(d.cambio_pre_terremoto) - y(0)))
        .attr('fill', colors.info)
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 1);
            tooltip.classed('show', true)
                .html(`
                    <strong>${d.canton}</strong><br>
                    Pre-terremoto (2015-2016)<br>
                    Cambio: <strong>${formatDecimal(d.cambio_pre_terremoto)}</strong>
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 0.8);
            tooltip.classed('show', false);
        });

    // Barra post-terremoto
    grupos.append('rect')
        .attr('x', x1('post'))
        .attr('y', d => d.cambio_post_terremoto > 0 ? y(d.cambio_post_terremoto) : y(0))
        .attr('width', x1.bandwidth())
        .attr('height', d => Math.abs(y(d.cambio_post_terremoto) - y(0)))
        .attr('fill', d => d.recuperacion ? colors.success : colors.warning)
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
            d3.select(this).attr('opacity', 1);
            tooltip.classed('show', true)
                .html(`
                    <strong>${d.canton}</strong><br>
                    Post-terremoto (2016-2017)<br>
                    Cambio: <strong>${formatDecimal(d.cambio_post_terremoto)}</strong><br>
                    ${d.recuperacion ? '✓ Recuperación' : '⚠ Sin recuperación'}
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).attr('opacity', 0.8);
            tooltip.classed('show', false);
        });

    // Ejes
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x0))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y));

    // Leyenda
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 250}, 10)`);

    const legendData = [
        {label: 'Pre-terremoto (2015-2016)', color: colors.info},
        {label: 'Post-terremoto con recuperación', color: colors.success},
        {label: 'Post-terremoto sin recuperación', color: colors.warning}
    ];

    legendData.forEach((item, i) => {
        const row = legend.append('g')
            .attr('transform', `translate(0, ${i * 25})`);

        row.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', item.color);

        row.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('font-size', '11px')
            .text(item.label);
    });

    // ========================================================================
    // 8. EVOLUCIÓN TEMPORAL POST-TERREMOTO
    // ========================================================================
    const margin2 = {top: 40, right: 150, bottom: 60, left: 60};
    const width2 = 900 - margin2.left - margin2.right;
    const height2 = 500 - margin2.top - margin2.bottom;

    const svg2 = d3.select('#chart-terremoto-evolucion')
        .append('svg')
        .attr('width', width2 + margin2.left + margin2.right)
        .attr('height', height2 + margin2.top + margin2.bottom)
        .append('g')
        .attr('transform', `translate(${margin2.left},${margin2.top})`);

    const top8 = impactoData.slice(0, 8);
    const years = [2015, 2016, 2017, 2018, 2019];

    const x2 = d3.scaleLinear()
        .range([0, width2])
        .domain([2015, 2019]);

    const allValues2 = top8.flatMap(d =>
        [d.ventas_2015, d.ventas_2016, d.ventas_2017, d.ventas_2018, d.ventas_2019]
    );

    const y2 = d3.scaleLinear()
        .range([height2, 0])
        .domain([d3.min(allValues2) - 0.5, d3.max(allValues2) + 0.5]);

    const colorScale2 = d3.scaleOrdinal()
        .domain(top8.map(d => d.canton))
        .range(d3.schemeCategory10);

    // Grid
    svg2.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y2)
            .tickSize(-width2)
            .tickFormat('')
        );

    // Línea vertical para el terremoto
    svg2.append('line')
        .attr('x1', x2(2016))
        .attr('x2', x2(2016))
        .attr('y1', 0)
        .attr('y2', height2)
        .attr('stroke', colors.danger)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

    svg2.append('text')
        .attr('x', x2(2016) + 10)
        .attr('y', 20)
        .style('font-size', '12px')
        .style('fill', colors.danger)
        .style('font-weight', 'bold')
        .text('↓ Terremoto Abril 2016');

    // Líneas
    top8.forEach(canton => {
        const data = [
            {year: 2015, value: canton.ventas_2015},
            {year: 2016, value: canton.ventas_2016},
            {year: 2017, value: canton.ventas_2017},
            {year: 2018, value: canton.ventas_2018},
            {year: 2019, value: canton.ventas_2019}
        ];

        const line = d3.line()
            .x(d => x2(d.year))
            .y(d => y2(d.value));

        svg2.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', colorScale2(canton.canton))
            .attr('stroke-width', 2.5)
            .attr('d', line);

        // Puntos
        svg2.selectAll(`.dot-${canton.canton.replace(/\s/g, '-')}`)
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => x2(d.year))
            .attr('cy', d => y2(d.value))
            .attr('r', 4)
            .attr('fill', colorScale2(canton.canton))
            .on('mouseover', function(event, d) {
                d3.select(this).attr('r', 7);
                tooltip.classed('show', true)
                    .html(`
                        <strong>${canton.canton}</strong><br>
                        Año: ${d.year}<br>
                        ln(Ventas): ${formatDecimal(d.value)}
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
    svg2.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height2})`)
        .call(d3.axisBottom(x2).tickFormat(d3.format('d')));

    svg2.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y2));

    // Leyenda
    const legend2 = svg2.append('g')
        .attr('transform', `translate(${width2 + 20}, 0)`);

    top8.forEach((canton, i) => {
        const legendRow = legend2.append('g')
            .attr('transform', `translate(0, ${i * 25})`);

        legendRow.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', colorScale2(canton.canton));

        legendRow.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('font-size', '12px')
            .text(canton.canton);
    });

    // Labels
    svg2.append('text')
        .attr('x', width2 / 2)
        .attr('y', height2 + 50)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Año');

    svg2.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height2 / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('ln(Ventas)');
});

console.log('✓ Visualizaciones D3.js cargadas exitosamente');
