import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';


function generateLineData(minValue, maxValue, maxDailyGainLoss = 1000) {
    var res = [];
    var time = new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0));
    for (var i = 0; i < 500; ++i) {
        var previous = res.length > 0 ? res[res.length - 1] : { value: 0 };
        var newValue = previous.value + ((Math.random() * maxDailyGainLoss * 2) - maxDailyGainLoss);

        res.push({
            time: time.getTime() / 1000,
            value: Math.max(minValue, Math.min(maxValue, newValue))
        });

        time.setUTCDate(time.getUTCDate() + 1);
    }

    return res;
}

function generateHistogramData(minValue, maxValue) {
    var res = [];
    var time = new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0));
    for (var i = 0; i < 500; ++i) {
        res.push({
            time: time.getTime() / 1000,
            value: minValue + Math.random() * (maxValue - minValue)
        });

        time.setUTCDate(time.getUTCDate() + 1);
    }

    return res;
}

export const ChartRenderer = (props) => {

    // https://github.com/tradingview/lightweight-charts/blob/master/docs/customization.md
    const { className, children, data = {}, ...options } = props;
    const containerRef = useRef();
    const [state, setState] = useState({ chart: null, sources: {} });

    const [paneRefs, setPaneRefs] = useState([]);

    useEffect(() => {
        const chart = createChart(containerRef.current, {
            timeScale: {
                borderColor: "rgb(225, 226, 227)"
            },
            overlayPriceScales: {
                scaleMargins: {
                    top: 0.6,
                    bottom: 0,
                }
            },
            rightPriceScale: {
                autoScale: true,
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.08,
                }
            }
        });

        const mainSeries = chart.addLineSeries({
            title: 'primary',
            priceFormat: {
                minMove: 1,
                precision: 0,
            },
        });
    
        mainSeries.setData(generateLineData(1000, 300000, 1500));

        const secondSeries = chart.addLineSeries({
            title: 'second',
            priceFormat: {
                minMove: 1,
                precision: 0,
            },
            color: '#ff0000',
            pane: 1
        });
        secondSeries.setData(generateLineData(0, 100, 20));

        const thirdSeries = chart.addLineSeries({
            title: 'third',
            priceFormat: {
                minMove: 1,
                precision: 0,
            },
            color: '#00ff00',
            pane: 1
        });
        thirdSeries.setData(generateLineData(0, 100, 20));
    
        const fourthSeries = chart.addLineSeries({
            title: 'fourth',
            priceFormat: {
                minMove: 1,
                precision: 0,
            },
            color: '#ea6622',
            pane: 2
        });
        fourthSeries.setData(generateLineData(0, 100, 20));
    
        const volumeSeries = chart.addHistogramSeries({
            secondary: 'volume',
            priceScaleId: '',
            pane: 0
        });
        volumeSeries.setData(generateHistogramData(100000, 3000000));

        setState({ chart: chart, sources: {} });
        return () => {
            setState({ chart: null, sources: {} });
            chart?.remove();
        };

    }, []);

    return (
        <div
            className={props.className}
            ref={containerRef}
            style={{position: "absolute", width: 100+'vw', height: 90+'%'}}
        >
        </div>
    );
};