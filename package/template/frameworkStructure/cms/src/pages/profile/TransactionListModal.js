import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import Response from '../../lib/Response';
import apiClient from '../../lib/apiClient';

export default function TransactionListModal(props) {
  let [transactions, setTransactions] = useState([]);
  let [lastTransactionId, setLastTransactionId] = useState(undefined);

  const getWalletTransactions = async () => {
    try {
      let walletTransactions = await apiClient(
        '/users/wallet_transactions',
        'GET',
        null,
        { last_transaction_id: undefined, limit: 10 },
        props.accessToken,
      );

      if (walletTransactions.responseCode === Response.STATUS_OK) {
        setTransactions([...transactions, ...walletTransactions.responseData.transactions]);
        if (!(walletTransactions.responseData.transactions.length < 10)) {
          let lastTransaction = walletTransactions.responseData.transactions[walletTransactions.responseData.transactions.length - 1];
          setLastTransactionId(lastTransaction.last_message_time);
        } else {
          setLastTransactionId(undefined);
        }
      }

    } catch (e) {
      console.log(e);
    }
  };

  const scrollCheck = event => {
    if (!event.target.scrollTop) return;
    const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
    if (bottom && lastTransactionId) {
      getWalletTransactions().catch(console.log);
    }
  };

  useEffect(() => {
    getWalletTransactions().catch(console.log);
  }, []);

  return (
    <Modal
      isOpen={props.isOpen}
      toggle={props.toggle}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <ModalHeader toggle={props.toggle}>
        <div id="contained-modal-title-vcenter">
          Transaction history
        </div>
      </ModalHeader>
      <ModalBody style={{ 'height': '500px', 'overflowY': 'scroll' }}>
        <Table responsive hover>
          <thead>
          <tr className="text-capitalize align-middle text-center">
            <th>Transaction value</th>
            <th>Transaction message</th>
            <th>Transaction Date</th>
            <th>Transaction Type</th>
          </tr>
          </thead>
          <tbody onScroll={scrollCheck}>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td className="align-middle text-center">{transaction.transaction_value}</td>
              <td className="align-middle text-center">{transaction.transaction_message}</td>
              <td
                className="align-middle text-center">{new Date(transaction.transaction_time).toLocaleDateString()}</td>
              <td className="align-middle text-center">{transaction.transaction_type === 1 ? 'Paid' : 'Received'}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
}
