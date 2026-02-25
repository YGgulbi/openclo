'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { RelationGraph } from '@/lib/types';

interface Props {
    data: RelationGraph;
}

const NODE_COLORS: Record<string, string> = {
    experience: '#818cf8',
    skill: '#10b981',
    interest: '#f59e0b',
    strength: '#a855f7',
};

const NODE_LABELS: Record<string, string> = {
    experience: '경험',
    skill: '역량',
    interest: '관심',
    strength: '강점',
};

export default function RelationshipGraph({ data }: Props) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !data?.nodes?.length) return;

        const width = svgRef.current.clientWidth || 600;
        const height = 380;

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Defs for glow filter
        const defs = svg.append('defs');
        const filter = defs.append('filter').attr('id', 'glow');
        filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
        const feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Force simulation
        const nodes = data.nodes.map((n) => ({ ...n, x: width / 2, y: height / 2 }));
        const links = data.links.map((l) => ({ ...l }));

        const simulation = d3
            .forceSimulation(nodes as any)
            .force(
                'link',
                d3
                    .forceLink(links)
                    .id((d: any) => d.id)
                    .distance(80)
                    .strength((d: any) => d.strength || 0.5)
            )
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide(35));

        // Draw links
        const link = svg
            .append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', 'rgba(255,255,255,0.1)')
            .attr('stroke-width', (d: any) => (d.strength || 0.5) * 2)
            .attr('stroke-linecap', 'round');

        // Draw nodes
        const nodeGroup = svg
            .append('g')
            .selectAll('g')
            .data(nodes)
            .join('g')
            .attr('cursor', 'pointer')
            .call(
                d3
                    .drag<any, any>()
                    .on('start', (event, d) => {
                        if (!event.active) simulation.alphaTarget(0.3).restart();
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on('drag', (event, d) => {
                        d.fx = event.x;
                        d.fy = event.y;
                    })
                    .on('end', (event, d) => {
                        if (!event.active) simulation.alphaTarget(0);
                        d.fx = null;
                        d.fy = null;
                    })
            );

        // Node circles
        nodeGroup
            .append('circle')
            .attr('r', 20)
            .attr('fill', (d: any) => `${NODE_COLORS[d.type] || '#6366f1'}30`)
            .attr('stroke', (d: any) => NODE_COLORS[d.type] || '#6366f1')
            .attr('stroke-width', 1.5)
            .attr('filter', 'url(#glow)');

        // Node labels
        nodeGroup
            .append('text')
            .text((d: any) => d.label.length > 6 ? d.label.slice(0, 6) + '…' : d.label)
            .attr('text-anchor', 'middle')
            .attr('dy', '0.3em')
            .attr('fill', 'rgba(255,255,255,0.8)')
            .attr('font-size', '9px')
            .attr('font-family', 'Pretendard, sans-serif');

        // Type badge
        nodeGroup
            .append('text')
            .text((d: any) => NODE_LABELS[d.type] || d.type)
            .attr('text-anchor', 'middle')
            .attr('dy', '30px')
            .attr('fill', (d: any) => NODE_COLORS[d.type] || '#6366f1')
            .attr('font-size', '8px')
            .attr('font-family', 'Pretendard, sans-serif')
            .attr('opacity', 0.7);

        simulation.on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);

            nodeGroup.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
        });

        return () => {
            simulation.stop();
        };
    }, [data]);

    // Legend
    const types = Object.entries(NODE_LABELS);

    return (
        <div className="glass rounded-2xl p-6 border border-white/5">
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mb-4">
                {types.map(([type, label]) => (
                    <div key={type} className="flex items-center gap-1.5">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ background: NODE_COLORS[type] }}
                        />
                        <span className="text-xs text-white/40">{label}</span>
                    </div>
                ))}
            </div>
            <p className="text-xs text-white/25 mb-4">노드를 드래그하여 이동할 수 있습니다</p>
            <svg ref={svgRef} className="w-full" style={{ height: 380 }} />
        </div>
    );
}
