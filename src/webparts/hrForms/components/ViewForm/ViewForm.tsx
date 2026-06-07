import * as  React from 'react'
import styles from './ViewForm.module.scss';

import { useParams } from "react-router-dom";

import ITEquipmentService from "../services/ITEquipmentService";
import { IITEquipment } from "../models/IITEquipments";

const ViewForm = () => {

    const { id } = useParams();
    const [data, setData] = React.useState<IITEquipment | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            try {
                if (!id) return;

                const response =
                    await ITEquipmentService.getITEquipmentById(
                        Number(id)
                    );
                console.log("Response:", response);

                setData(response);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>Record not found.</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h2>Employee Information</h2>

                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Title : </label>
                        <span>{data?.Title || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Employee Name : </label>
                        <span>{data?.FirstName || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Staff No : </label>
                        <span>{data?.StaffNo || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Department : </label>
                        <span>{data?.Department || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Date : </label>
                        <span>{data?.Date || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Status : </label>
                        <span>{data?.ApprovalStatus || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Request Type : </label>
                        <span>{data?.RequestType || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Reason : </label>
                        <span>{data?.Reason || "N/A"}</span>
                    </div>

                    <div className={styles.field}>
                        <label>Attachments : </label>
                        <div>
                            {data?.Attachments && data.Attachments.length > 0 ? (
                                <ul className={styles.attachmentList}>
                                    {data.Attachments.map((file) => (
                                        <li key={file.FileName}>
                                            <a
                                                href={file.ServerRelativeUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                📎 {file.FileName}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span>N/A</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Signature : </label>
                        <img
                            src={data?.EmployeeSignature?.replace(/^"|"$/g, "").trim()}
                            alt="Signature"
                        />
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2>Approved By Head of Department</h2>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Name : </label>
                        <span>{data.HODApprovarName?.Title || "N/A"}</span>
                    </div>
                    <div className={styles.field}>
                        <label>Date : </label>
                        <span>{data.HODDate || "N/A"}</span>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2>Approved By Head of IT Department</h2>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Name : </label>
                        <span>{data.HODITApprovarName?.Title || "N/A"}</span>
                    </div>
                    <div className={styles.field}>
                        <label>Date : </label>
                        <span>{data.HODITDate || "N/A"}</span>
                    </div>
                </div>
            </div>

            <div className={styles.section}>
                <h2>Approved By IT Staff Member</h2>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Name : </label>
                        <span>{data.ITStaffApprovarName?.Title || "N/A"}</span>
                    </div>
                    <div className={styles.field}>
                        <label>Date : </label>
                        <span>{data.ITStaffDate || "N/A"}</span>
                    </div>
                </div>
            </div>

            <div className={styles.actionBar}>
                <button className={styles.printBtn}>Print</button>
            </div>
        </div>
    )
}

export default ViewForm