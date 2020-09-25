/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from "react";
import "./App.css";
import * as mmb from "music-metadata-browser";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parseResults: [],
        };
    }

    render() {
        console.log("render called");

        const htmlParseResults = [];

        for (const parseResult of this.state.parseResults) {
            console.log(`metadata ${parseResult.file.name}`, parseResult);

            const htmlMetadata = parseResult.metadata ? (
                <table>
                    <tbody>
                        <tr>
                            <th>Artist</th>
                            <td>{parseResult.metadata.common.artist}</td>
                        </tr>
                        <tr>
                            <th>Title</th>
                            <td>{parseResult.metadata.common.title}</td>
                        </tr>
                        <tr>
                            <th>Album</th>
                            <td>{parseResult.metadata.common.album}</td>
                        </tr>
                        <tr>
                            <th>Cover</th>

                            <td>
                                <img
                                    src={`data:${
                                        parseResult.metadata.common.picture[0].format
                                    };base64,${parseResult.metadata.common.picture[0].data.toString("base64")}`}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : parseResult.error ? (
                <p className="App-error">{parseResult.error}</p>
            ) : (
                <p>Parsing...</p>
            );

            htmlParseResults.push(
                <div key={parseResult.file.name}>
                    <h3>{parseResult.file.name}</h3>
                    {htmlMetadata}
                </div>
            );
        }

        if (this.state.parseResults.length === 0) {
            htmlParseResults.push(<div key="message">Please choose an audio file</div>);
        }

        return (
            <div className="App">
                <input type="file" name="file" onChange={this.onChangeHandler} />

                {htmlParseResults}
            </div>
        );
    }

    onChangeHandler = async (event) => {
        this.setState({
            parseResults: [],
        });

        for (const file of event.target.files) {
            const parseResult = {
                file: file,
            };

            this.setState((state) => {
                state.parseResults.push(parseResult);
                return state;
            });

            try {
                const metadata = await this.parseFile(file);
                // Update GUI
                this.setState((state) => {
                    state.parseResults[state.parseResults.length - 1].metadata = metadata;
                    return state;
                });
            } catch (err) {
                this.setState((state) => {
                    state.parseResults[state.parseResults.length - 1].error = err.message;
                    return state;
                });
            }
        }
    };

    async parseFile(file) {
        console.log(`Parsing file "${file.name}" of type ${file.type}`);

        return mmb.parseBlob(file, { native: true }).then((metadata) => {
            console.log(`Completed parsing of ${file.name}:`, metadata);
            return metadata;
        });
    }
}

export default App;
