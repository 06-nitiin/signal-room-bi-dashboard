export default function ChannelMix() {
    return (
        <div className="mix-chart" aria-label="Acquisition channel mix">
            <div className="donut"><div className="donut-hole"><strong>42%</strong><span>organic</span></div></div>
            <div className="mix-list">
                <div><span><i className="mix-organic" />Organic</span><strong>42%</strong></div>
                <div><span><i className="mix-paid" />Paid</span><strong>28%</strong></div>
                <div><span><i className="mix-partner" />Partner</span><strong>18%</strong></div>
                <div><span><i className="mix-other" />Other</span><strong>12%</strong></div>
            </div>
        </div>
    );
}