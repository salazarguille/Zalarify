import React from "react";

export function listenOn (result, thisComponent, config, callback = undefined) {
    if (result === undefined) {
        return;
    }
    const { confirmations } = config;
    try {
        result.on('transactionHash', (hash) => {
            if(config.network === 'unknown') {
                thisComponent.setNotProcessing();
                result.removeAllListeners();
                if(callback !== undefined) {
                    callback();
                }
            }
            thisComponent.toast(<div>
            <a href={`${config.explorer.tx}${hash}`} rel="noopener noreferrer" target="_blank">Processing Transaction</a>
            </div>);
        })
      .on('receipt', (receipt) => {
        console.log(receipt);
        thisComponent.toast(<div>
          Success <a href={`${config.explorer.tx}${receipt.tx}`} rel="noopener noreferrer" target="_blank">Transaction</a>
        </div>);
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        if(confirmationNumber < confirmations) {
            thisComponent.toast(<div>
            {`Confirmation #${confirmationNumber}`} <a href={`${config.explorer.tx}${receipt.tx}`} rel="noopener noreferrer" target="_blank">View Transaction</a>
          </div>);
        } else {
          if (confirmationNumber === confirmations) {
            thisComponent.setNotProcessing();
            result.removeAllListeners();
            if(callback !== undefined) {
                callback();
            }
          }
        }
      })
      .on('error', (error) => {
        thisComponent.toast(<div>
          {`Message: ${error.message}`}
        </div>, true);
      });
    } catch (error) {
      thisComponent.toast(<div>
        {`Message: ${error.message}`}
      </div>, true);
    }
};