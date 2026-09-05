import { useCallback, useEffect, useState } from 'react'
import './CurrentlyBuilding.css'

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const emptyProject = { title: '', description: '', status: 'In progress', url: '' }
const statuses = ['Planning', 'In progress', 'On hold', 'Launched']

export default function CurrentlyBuilding() {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [draft, setDraft] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const loadProjects = useCallback(async () => {
        setLoading(true)
        setLoadError('')
        try {
            const response = await fetch(`${apiBase}/api/currently-building`)
            if (!response.ok) throw new Error()
            setProjects(await response.json())
        } catch {
            setLoadError('Projects could not be loaded. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadProjects() }, [loadProjects])
    useEffect(() => {
        let active = true
        const checkAdmin = async () => {
            let allowed = false
            try {
                const response = await fetch(`${apiBase}/api/me`, { credentials: 'include' })
                allowed = response.ok && (await response.json()).isAdmin === true
            } catch { /* Guests can still read projects when authentication is unavailable. */ }
            if (active) {
                setIsAdmin(allowed)
                if (!allowed) { setDraft(null); setDeletingId(null) }
            }
        }
        checkAdmin()
        window.addEventListener('focus', checkAdmin)
        window.addEventListener('auth-changed', checkAdmin)
        const timer = window.setInterval(checkAdmin, 60000)
        return () => {
            active = false
            window.clearInterval(timer)
            window.removeEventListener('focus', checkAdmin)
            window.removeEventListener('auth-changed', checkAdmin)
        }
    }, [])

    const mutate = async (method, id, data) => {
        setSaving(true)
        setError('')
        setMessage('')
        try {
            const response = await fetch(`${apiBase}/api/currently-building${id ? `/${id}` : ''}`, {
                method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data ?? {}),
            })
            if (response.status === 401 || response.status === 403) {
                setIsAdmin(false)
                setDraft(null)
                setDeletingId(null)
                throw new Error('Your admin session has ended. Sign in again to make changes.')
            }
            if (!response.ok) {
                const body = await response.json().catch(() => ({}))
                throw new Error(body.message || 'Could not save this change. Please try again.')
            }
            if (method === 'DELETE') {
                setProjects(current => current.filter(project => project._id !== id))
                setDeletingId(null)
            } else {
                const project = await response.json()
                setProjects(current => id ? current.map(item => item._id === id ? project : item) : [project, ...current])
                setDraft(null)
            }
            setMessage(method === 'DELETE' ? 'Project deleted.' : 'Project saved.')
        } catch (failure) {
            setError(failure.message)
        } finally {
            setSaving(false)
        }
    }

    const openEditor = (project) => {
        setEditingId(project?._id ?? null)
        setDraft(project ? { title: project.title, description: project.description, status: project.status, url: project.url } : { ...emptyProject })
        setDeletingId(null)
        setError('')
        setMessage('')
    }
    const changeField = (event) => setDraft(current => ({ ...current, [event.target.name]: event.target.value }))

    return (
        <section className="building-section" id="currently-building" aria-labelledby="building-heading">
            <div className="building-inner">
                <header className="building-header">
                    <h2 id="building-heading">Currently Building</h2>
                    {isAdmin && !draft && <button onClick={() => openEditor(null)} disabled={saving}>Add project</button>}
                </header>
                {error && <p className="building-error" role="alert">{error}</p>}
                {message && <p role="status">{message}</p>}
                {isAdmin && draft && (
                    <form className="building-editor" onSubmit={event => { event.preventDefault(); mutate(editingId ? 'PUT' : 'POST', editingId, draft) }}>
                        <h3>{editingId ? 'Edit project' : 'New project'}</h3>
                        <fieldset disabled={saving}>
                            <label>Title<input name="title" value={draft.title} onChange={changeField} maxLength={120} required autoFocus /></label>
                            <label>Description<textarea name="description" value={draft.description} onChange={changeField} maxLength={3000} rows={4} required /></label>
                            <label>Status<select name="status" value={draft.status} onChange={changeField}>{statuses.map(status => <option key={status}>{status}</option>)}</select></label>
                            <label>Project link (optional)<input name="url" type="url" placeholder="https://" value={draft.url} onChange={changeField} maxLength={2048} /></label>
                            <div className="building-actions">
                                <button type="submit">{saving ? 'Saving…' : 'Save project'}</button>
                                <button type="button" onClick={() => setDraft(null)}>Cancel</button>
                            </div>
                        </fieldset>
                    </form>
                )}
                {loading && <p role="status">Loading projects…</p>}
                {loadError && <div role="alert"><p>{loadError}</p><button onClick={loadProjects}>Try again</button></div>}
                {!loading && !loadError && projects.length === 0 && <p className="building-empty">New projects are on the way. Check back soon.</p>}
                <div className="building-grid">
                    {projects.map(project => (
                        <article className="building-card" key={project._id}>
                            <span className="building-status">{project.status}</span>
                            <h3>{project.title}</h3>
                            <p className="building-description">{project.description}</p>
                            {project.url && /^https?:\/\//i.test(project.url) && <a href={project.url} target="_blank" rel="noopener noreferrer">Explore project <span aria-hidden="true">↗</span></a>}
                            {isAdmin && <div className="building-actions">
                                <button disabled={saving || Boolean(draft)} onClick={() => openEditor(project)} aria-label={`Edit ${project.title}`}>Edit</button>
                                <button disabled={saving || Boolean(draft)} onClick={() => setDeletingId(project._id)} aria-label={`Delete ${project.title}`}>Delete</button>
                            </div>}
                            {isAdmin && deletingId === project._id && <div className="building-delete" role="group" aria-label={`Confirm deletion of ${project.title}`}>
                                <p>Delete “{project.title}”? This cannot be undone.</p>
                                <div className="building-actions">
                                    <button disabled={saving} onClick={() => mutate('DELETE', project._id)}>{saving ? 'Deleting…' : 'Confirm delete'}</button>
                                    <button disabled={saving} onClick={() => setDeletingId(null)}>Cancel</button>
                                </div>
                            </div>}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
