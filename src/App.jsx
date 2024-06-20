import React from "react";
import { nanoid } from "nanoid";
import blankConfig from "./data/blankConfig";
import Clock from "./Componentes/Clock";
import News from "./Componentes/News";
import Quote from "./Componentes/Quote";
import Stocks from "./Componentes/Stocks";
import ToDo from "./Componentes/ToDo";
import Weather from "./Componentes/Weather";
import ConfigMenu from "./Componentes/ConfigMenu";

function App() {
    const DEFAULT_CONFIG = blankConfig.map((widget) => {
        return { ...widget, positionData: { ...widget.positionData } };
    });

    const [widgetConfig, setWidgetConfig] = React.useState(getInitialConfig());

    const [saveRequested, setSaveRequested] = React.useState(false);

    function save() {
        setSaveRequested(true);
        localStorage.setItem("userconfig", JSON.stringify(widgetConfig));
    }

    function getInitialConfig() {
        return JSON.parse(localStorage.getItem("userconfig")) || DEFAULT_CONFIG;
    }

    const widgetComponents = {
        Clock: <Clock />,
        News: <News />,
        Quote: <Quote />,
        Stocks: <Stocks />,
        ToDo: <ToDo />,
        Weather: <Weather />,
    };

    const savedMessage = (
        <div className="saved-message-container">
            <p className="saved-message">Saved!</p>
        </div>
    );

    React.useEffect(() => {
        if (saveRequested) {
            setTimeout(() => {
                setSaveRequested(false);
            }, 1000);
        }
    }, [saveRequested]);

    function dragHandler(e, data) {
        if (e.target.dataset.type !== "button") {
            setWidgetConfig((prevConfig) => {
                let allConfigs = [...prevConfig];
                let targetConfig = allConfigs.find(
                    (widget) => widget.name === data.node.classList[1]
                );
                targetConfig.positionData = {
                    ...targetConfig.positionData,
                    customPosition: true,
                    x: data.x,
                    y: data.y,
                };
                return allConfigs;
            });
        }
    }

    function getOffset(name) {
        let targetConfig = widgetConfig.find((widget) => widget.name === name);
        if (!targetConfig.positionData.customPosition) {
            return undefined;
        } else {
            return {
                x: targetConfig.positionData.x,
                y: targetConfig.positionData.y,
            };
        }
    }

    const widgetsToDisplay = widgetConfig
        .filter((widget) => widget.selected)
        .map((widget) => {
            const component = {
                ...widgetComponents[widget.name],
                key: nanoid(),
            };
            component.props = {
                ...component.props,
                name: widget.name,
                gridArea: widget.positionData.gridArea,
                getOffset: getOffset,
                dragHandler: dragHandler,
                changeHandler: changeHandler,
            };
            return component;
        });

    function changeHandler(event) {
        setWidgetConfig((prevConfig) => {
            return prevConfig.map((widget) => {
                return widget.name === event.target.name
                    ? { ...widget, selected: !widget.selected }
                    : { ...widget };
            });
        });
    }

    return (
        <>
            <div className="wrapper">
                {saveRequested && savedMessage}
                <div className="widget-container">{widgetsToDisplay}</div>
                <ConfigMenu
                    stateProps={{
                        widgetConfig,
                        setWidgetConfig,
                        DEFAULT_CONFIG,
                    }}
                    changeHandler={changeHandler}
                    save={save}
                />
            </div>
        </>
    );
}

export default App;
