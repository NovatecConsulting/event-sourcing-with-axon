import {CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {selectProjectById, useGetProjectsQuery} from "./projectsSlice";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {useAppSelector} from "../../app/hooks";
import {EntityId} from "@reduxjs/toolkit";

export function ProjectsList() {
    const {
        data: projectsEntityState,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetProjectsQuery();

    let content: ReactJSXElement;
    if (isLoading) {
        content = <CircularProgress/>;
    } else if (isSuccess && projectsEntityState) {
        content = (
            <TableContainer sx={{flex: 1, maxWidth: 900}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Planned Start Date</TableCell>
                            <TableCell>Deadline</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            projectsEntityState.ids.map(
                                (projectId: EntityId) => <ProjectRow key={projectId} projectId={projectId}/>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        );
    } else if (isError) {
        content = <div>{error}</div>;
    } else {
        return null;
    }

    return content;
}

function ProjectRow({projectId}: { projectId: EntityId }) {
    const project = useAppSelector(state => selectProjectById(state, projectId))

    if (project) {
        return (
            <TableRow hover>
                <TableCell>{project.identifier}</TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.plannedStartDate}</TableCell>
                <TableCell>{project.deadline}</TableCell>
            </TableRow>
        );
    }
    return null;
}